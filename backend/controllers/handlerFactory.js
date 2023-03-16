const tmp = require('tmp');
const multer = require('multer');
const sharp = require('sharp');
const aws = require('aws-sdk');
const fs = require('fs');

const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

// NOTE: Firebase implementation
// const admin = require('firebase-admin');
// const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS;
// admin.initializeApp({
//   credential: admin.credential.cert(JSON.parse(serviceAccount)),
//   storageBucket: 'leonardo-web.appspot.com'
// });
// const bucket = admin.storage().bucket();

aws.config.update({
  accessKeyId: process.env.AMAZON_USER_ID,
  secretAccessKey: process.env.AMAZON_USER_KEY,
  region: process.env.AMAZON_REGION
});

const s3 = new aws.S3();

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.setFields = fields => upload.fields([...fields]);

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError(`No doc found with that ID`, 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!doc) {
      return next(new AppError(`No document found with that ID`, 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    // const newTour = new Tour({})
    // newTour.save();

    const newDoc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: newDoc
      }
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError(`No doc found with that ID`, 404));
    }

    res.status(200).json({
      status: 'success',
      data: { doc }
    });
  });

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    const docs = await Model.find().sort('orderIndex');
    // NOTE: the explain method is used to check info about a query, for example how many docs were scanned to find/get the result
    // const docs = await features.query.explain();

    // Send response
    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: { docs }
    });
  });

exports.deleteLogo = (Model, options) => {
  const { fileType, paramId } = options;
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id, `${fileType}`, {
      lean: true
    });
    const { _id } = doc;

    const logoToRemove = doc[fileType][req.params[paramId]];
    await Model.findByIdAndUpdate(_id, {
      $pull: { [fileType]: logoToRemove }
    });

    // NOTE: this name extraction could be improved to be more stable
    const parsedUrl = logoToRemove.split('/');
    const filePath = parsedUrl[parsedUrl.length - 1];

    // NOTE: Firebase implementation
    // await bucket.file(filePath).delete();
    await s3
      .deleteObject({
        Bucket: process.env.AMAZON_BUCKET,
        Key: filePath
      })
      .promise();

    res.status(204).json({
      status: 'success',
      data: null
    });
  });
};

exports.deleteStorageFiles = (Model, options) => {
  const { fileType } = options;

  return catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id, `${fileType}`, {
      lean: true
    });

    await Promise.all(
      doc[fileType].map(async item => {
        const parsedUrl = item.split('/');
        const filePath = parsedUrl[parsedUrl.length - 1];
        await s3
          .deleteObject({
            Bucket: process.env.AMAZON_BUCKET,
            Key: filePath
          })
          .promise();
        // NOTE: Firebase implementation
        // await bucket.file(filePath).delete();
      })
    );
    next();
  });
};

exports.resizeImages = (Model, options) => {
  return catchAsync(async (req, res, next) => {
    const { name, format, fileType, sizes } = options;
    if (!req.files[fileType]) {
      delete req.body[fileType];
      return next();
    }
    req.body[fileType] = [];

    const tmpObj = tmp.dirSync({ unsafeCleanup: true });
    await Promise.all(
      req.files[fileType].map(async (file, idx) => {
        const filename = `${name}-${fileType}-${Date.now()}-${idx +
          1}.${format}`;

        await sharp(file.buffer)
          .resize(...sizes)
          .toFormat(`${format}`)
          .png({ quality: 90, progressive: true })
          .toFile(`${tmpObj.name}/${filename}`);

        // NOTE: Firebase implementation
        // const uploadOptions = {
        //   gzip: true,
        //   predefinedAcl: 'publicRead',
        //   public: true,
        //   metadata: {
        //     contentType: 'image/*'
        //   }
        // };
        //
        // await bucket.upload(`${tmpObj.name}/${filename}`, uploadOptions);
        // const metadata = await bucket.file(`${filename}`).getMetadata();
        // req.body[fileType].push(metadata[0].mediaLink);

        await s3
          .putObject({
            Bucket: process.env.AMAZON_BUCKET,
            Body: fs.readFileSync(`${tmpObj.name}/${filename}`),
            Key: filename,
            ACL: 'public-read'
          })
          .promise();

        const s3Object = await s3.getObject({
          Bucket: process.env.AMAZON_BUCKET,
          Key: filename
        });

        const fullUrl = `${s3Object.httpRequest.endpoint.protocol}//${process.env.AMAZON_BUCKET}.${s3Object.httpRequest.endpoint.host}/${filename}`;

        req.body[fileType].push(fullUrl);
      })
    );

    tmpObj.removeCallback();
    if (req.route.methods.patch) {
      await Model.findByIdAndUpdate(req.params.id, {
        $push: { [fileType]: req.body[fileType] }
      });
      delete req.body[fileType];
    }
    next();
  });
};
