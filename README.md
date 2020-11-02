## Description

![](https://github.com/pately/file-manager/workflows/Node.js%20CI/badge.svg)

## Minimal Swagger API Documentation can be found on http://localhost:3000/api/

## App Runs on PORT 3000 by 

# File Manager REST Web-Service
Web service with following functionality 

### POST /file​/upload
file upload - Upload a text file and store it.

### GET /file/random
One random line - Return one random line of a previously uploaded file via http as text/plain, application/json or application/xml depending on the request accept header. All three headers must be supported.

If the request is application/* please include following details in the response:

    line number
    file name
    the letter which occurs most often in this line 

### GET /file​/random_back
one random line backwards - Returns the requested line backwards

### GET /file/top100
longest 100 lines - Returns the 100 longest lines of all files uploaded

### GET /file​/top20​/:fileName?
20 longest lines of one file - Returns the 20 longest lines of one file uploaded or last uploaded file

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

  Nest is [MIT licensed](LICENSE).
