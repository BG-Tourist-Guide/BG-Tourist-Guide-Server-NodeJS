'use strict';
let express = require('express');
let mongooseConfig = require('./server/config/mongoose-config');
let expressConfig = require('./server/config/express-config');
let passportConfig = require('./server/config/passport-config');
let routeConfig = require('./server/config/routes');
let qrCodes = require('./server/services/qr-codes-service').defaultInstance;

let app = express();
let port = process.env.PORT || 4000;

mongooseConfig.configure();
passportConfig.configure();
expressConfig.configure(app);
routeConfig.registerRoutes(app);
qrCodes.createQrCodesForAllTouristSites()
  .then(function (result) {
    console.log(result);
    app.listen(port, () => console.log(`Server running on port: ${port}`));
  }, function(err) {
    console.log(err);
  });
