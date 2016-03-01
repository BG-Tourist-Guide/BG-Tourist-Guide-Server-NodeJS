# BG-Tourist-Guide-Server-NodeJS
Node.js server for the BG Tourist Guide application

## Routes:
* Users:
    * Register - (POST) /api/users:
      * {
          "userName": "someUser",
          "password": "123456"
      }
    * Login - (PUT) /api/users/token:
      * {
          "userName": "someUser",
          "password": "123456"
      }
* Tourist Sites:
    * Get All - (Get) /api/tourist-sites
    * Add - (POST) /api/tourist-sites:
      * {
          "title": "someTitle",
          "description": "someDescription",
          "isOfficial": false,
          "latitude": 43.12321,
          "longitude": 23.12312,
          "address": "someAddress"
      }
