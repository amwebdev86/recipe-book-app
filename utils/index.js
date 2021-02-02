const fs = require('fs');
const asyncHandler = require('./asyncHandler');
/**
 * Saves the data to the specified filename
 * @param {string} filename 
 * @param {json} data 
 */
function saveData(filename, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, JSON.stringify(data, null, 2), (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
function loadData(filename){
  let file = filename;
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf-8', (err, data) => {
          if (err) {
            reject(err);
          } else {
            const json = JSON.parse(data);
            resolve(json);
          }
        });
      });
}
function generateRandomId() {
    return Math.floor(Math.random() * 10000);
  }


module.exports = {
  saveData,
  loadData,
  generateRandomId,
  asyncHandler
};
