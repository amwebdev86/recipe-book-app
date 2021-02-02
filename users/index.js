const fs = require('fs');

function getUsers() {
  return new Promise((resolve, reject) => {
    fs.readFile('./users/users.json', 'utf-8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        const users = JSON.parse(data);
        resolve(users);
      }
    });
  });
}

module.exports = {
  getUsers,
};
