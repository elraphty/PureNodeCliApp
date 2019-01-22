/**
 * Data File for saving data to file db
 * Created By Raphael Osaze Eyerin
 * On 18 Dec 2018
 */

const path = require('path');
const fs = require('fs');
const helpers = require('./helpers');

const lib = {};

// Base directory to data folder
lib.baseDir = path.join(__dirname, '/../.data/');

// Write data to a file
lib.create = (dir, file, data, callback) => {
  fs.open(`${lib.baseDir+dir}/${file}.json`, 'wx', (err, descriptor) => {
    if(!err && descriptor) {
      let jsonData = JSON.stringify(data);
      fs.writeFile(descriptor, jsonData, (err) => {
        if(!err) {
          fs.close(descriptor, (err) => {
            if(err) {
              callback('Error while closing file');
            } else {
              callback(false);
            }
          })
        } else {
          callback('Error Occured while Wrriting file');
        }
      })
    } else {
      callback('Error opening file user may already exists');
    }
  });
};

// Function for reading files and returning them as javascript objects
lib.read = (dir, file, callback) => {
  let fileName = file+'.json';
  fs.readFile(`${lib.baseDir+dir}/${fileName}`, 'utf8', (err, data) => {
    if(!err && data) {
      callback(false, helpers.parseJsonToObject(data));
    } else {
      callback('Error could not read file');
    }
  });
}

// Function for updating files
lib.update = (dir, file, newContent, callback) => {
  fs.open(`${lib.baseDir+dir}/${file}.json`, 'r+', (err, descriptor) => {
    if(!err && descriptor) {
      fs.ftruncate(descriptor, (err) => {
        if(!err) {
          let jsonData = JSON.stringify(newContent);
          fs.writeFile(descriptor, jsonData, (err) => {
            if(!err) {
              fs.close(descriptor, (err) => {
                if(!err) {
                  callback(false);  
                } else {
                  callback('Error closing file');  
                }
              })
            } else {
              callback('Error writing to file');
            }
          });
        } else {
          console.log('Error truncating file');
          callback('Error truncating file'); 
        }  
      })
    } else {
      console.log('Error opening file');
      callback('Error opening file')
    }
  });
}

// Function for deleting files
lib.delete = (dir, file, callback) => {
  fs.unlink(`${lib.baseDir + dir}/${file}.json`, (err) => {
    if(!err) {
      callback(false);
    } else {
      callback('Error occured while unlinking file');
    }
  });
}

// List all the items in a directory
lib.list = (dir, callback) => {
  fs.readdir(`${lib.baseDir + dir}/`, (err, data) => {
    if(!err && data && data.length > 0) {
      const trimmedFileNames = [];
      data.forEach((fileName) => {
        trimmedFileNames.push(fileName.replace('.json', ''));
      });
      callback(false, trimmedFileNames);
    } else {
      callback(500)
    }
  })
}

// get creation time of item in a directory
lib.createdTime = (dir, fileName, callback) => {
  fs.stat(`${lib.baseDir + dir}/${fileName}.json`, (err, stat) => {
    if(!err && stat) {
      // console.log(stat.birthtimeMs, Date.now(), (1000 * 60 * 60));
      callback(false, (Date.now() - stat.birthtimeMs) / 3600000);
    } else {
      callback(500)
    }
  })
}

module.exports = lib;