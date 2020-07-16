const fs = require("fs");
const rules = require('../rules')


class FileUtil {
  constructor() { }

  write(fileName, req) {
    console.log('rule to ', req)
    const newRUle = req;
    rules.push(newRUle);
  let final = "rules =" + JSON.stringify(rules) + "\n\r module.exports=rules";

    return new Promise((resolve, reject) => {

      fs.writeFile('rules.js', final, (err, data) => {

        if (err) {
          console.log('errrr')

          reject(err)  // calling `reject` will cause the promise to fail with or without the error passed as an argument

          return        // and we don't want to go any further

        }
        console.log('data')
        resolve(data)

      })

    })
  }





}
fileUtilObject = new FileUtil();
module.exports = fileUtilObject;

