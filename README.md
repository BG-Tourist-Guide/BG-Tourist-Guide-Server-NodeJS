# BG-Tourist-Guide-Server-NodeJS
Node.js server for the BG Tourist Guide application

## Routes:
* ##### Users:
    * Register - (POST) /api/users/:
      * {
          "userName": "someUser",
          "password": "123456"
      }
      * Login - (PUT) /api/users/token:
        * {
            "userName": "someUser",
            "password": "123456"
        }
