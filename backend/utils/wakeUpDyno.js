const https = require('https');

const wakeUpDyno = (url, interval = 25, callback) => {
  const milliseconds = interval * 60000;

  const time = new Date().getHours();
  if (time < 7 || time >= 12) {
    setTimeout(() => {
      try {
        console.log(`setTimeout called.`);
        // HTTP GET request to the dyno's url
        https
          .get(url, function(res) {
            console.log('statusCode: ', res.statusCode);
            res.on('data', function() {
              console.log(`Fetching ${url}.`);
            });
          })
          .on('error', function(e) {
            console.log(`Error fetching ${url}: ${e.message} 
            Will try again in ${interval} minutes...`);
          });

        // https.get(url).then(() => console.log(`Fetching ${url}.`));
      } catch (err) {
        // catch fetch errors
        console.log(`Error fetching ${url}: ${err.message} 
            Will try again in ${interval} minutes...`);
      } finally {
        try {
          callback(); // execute callback, if passed
        } catch (e) {
          // catch callback error
          if (callback) {
            console.log('Callback failed: ', e.message);
          }
        } finally {
          // do it all again
          wakeUpDyno(url, interval, callback);
        }
      }
    }, milliseconds);
  }
};

module.exports = wakeUpDyno;
