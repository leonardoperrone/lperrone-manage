const multer = require('multer');
const sharp = require('sharp');
const admin = require('firebase-admin');
const tmp = require('tmp');

const Technology = require('../models/technologyModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');

// const serviceAccount = require(`${process.env.GOOGLE_APPLICATION_CREDENTIALS}`);

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  storageBucket: 'leonardo-web.appspot.com'
});

const bucket = admin.storage().bucket();

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

exports.uploadTechImages = upload.fields([
  { name: 'logos', minCount: 1, maxCount: 4 }
]);

// NOTE: can do 1 img vs array vs many arrays
// upload.single('image') -> req.file
// upload.array(;'images', 5) -> req.files

exports.resizeTechImages = catchAsync(async (req, res, next) => {
  // console.log(req.files);

  if (!req.files.logos) return next();
  // 1. Cover image
  //   await sharp(req.files.imageCover[0].buffer)
  //     .resize(2000, 1333)
  //     .toFormat('jpeg')
  //     .jpeg({ quality: 90 })
  //     .toFile(`public/img/tours/${req.body.imageCover}`);

  // 2. Images
  req.body.logos = [];
  const tmpobj = tmp.dirSync({ unsafeCleanup: true });

  await Promise.all(
    req.files.logos.map(async (file, idx) => {
      const filename = `tech-${req.body.name}-${Date.now()}-${idx + 1}.png`;

      await sharp(file.buffer)
        .resize(100, 100)
        .toFormat('png')
        .jpeg({ quality: 90 })
        .toFile(`${tmpobj.name}/${filename}`);

      const uploadOptions = {
        gzip: true,
        predefinedAcl: 'publicRead',
        public: true,
        metadata: {
          contentType: 'image/*'
        }
      };

      await bucket.upload(`${tmpobj.name}/${filename}`, uploadOptions);
      const metadata = await bucket.file(`${filename}`).getMetadata();
      req.body.logos.push(metadata[0].mediaLink);
    })
  );

  tmpobj.removeCallback();
  next();
});

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing name or price'
//     });
//   }
//   next();
// };

// exports.checkId = (req, res, next, val) => {
//   if (parseInt(val, 10) > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID'
//     });
//   }
//   next();
// };

// ROUTE HANDLERS
exports.getTechologies = factory.getAll(Technology);
exports.getTechology = factory.getOne(Technology);
exports.createTechology = factory.createOne(Technology);
exports.updateTechology = factory.updateOne(Technology);
exports.deleteTechology = factory.deleteOne(Technology);
