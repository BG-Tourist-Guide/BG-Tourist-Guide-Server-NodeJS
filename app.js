'use strict';
let express = require('express');
let mongooseConfig = require('./server/config/mongoose-config');
let expressConfig = require('./server/config/express-config');
let passportConfig = require('./server/config/passport-config');
let routeConfig = require('./server/config/routes');
let logger = require('./server/common/logger');

let app = express();
let port = process.env.PORT || 4000;

mongooseConfig.configure();
passportConfig.configure();
expressConfig.configure(app);
routeConfig.registerRoutes(app);
app.listen(port, () => logger.log(`Server running on port: ${port}`));
