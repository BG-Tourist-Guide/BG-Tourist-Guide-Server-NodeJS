'use strict';

let fs = require('fs');
let path = require('path');
let constants = require('./../common/constants');
let logger = require('./../common/logger');

class LogsService {
  getMessages() {
    return this.getLogsFromFolder(constants.MESSAGES_LOGS_FOLDER);
  }

  getErrors() {
    return this.getLogsFromFolder(constants.ERRORS_LOGS_FOLDER);
  }
  
  getLogsFromFolder(folderName) {
    let promises = [];
    let logFilesContent = {};
    let promise = new Promise(function(resolve, reject) {
      fs.readdir(folderName, function(err, files) {
        if (err) {
          logger.err(err);
          reject(err);
          return;
        }
        
        files.forEach(function(file) {
          let logsFilePath = path.join(folderName, file);
          let readFilePromise = new Promise(function(readFileResolve, readFileReject) {
            fs.readFile(logsFilePath, function(readFileError, fileContent) {
              if (readFileError) {
                logger.err(readFileError);
                readFileReject(readFileError);
                return;
              }
              
              logFilesContent[file] = fileContent.toString().split('\n');
              readFileResolve(fileContent);
            });
          });
          
          promises.push(readFilePromise);
        });
                
        Promise.all(promises)
          .then(function(result) {
            resolve(logFilesContent);
          }, function(err) {
            logger.err(err);
            reject(err);
          });
      });
    });

    return promise;
  }
}

module.exports = {
  LogsService: LogsService,
  defaultInstance: new LogsService()
};