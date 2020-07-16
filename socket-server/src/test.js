//let date_ob = new Date();
let ts = Date.now();

//console.log(ts)
let date_ob = new Date(ts);
var fs = require('fs');
let date = date_ob.getDate();
let month = date_ob.getMonth() + 1;
let year = date_ob.getFullYear();
let hours = date_ob.getHours();
//jhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhefegterger
// current minutes
let minutes = date_ob.getMinutes();

// current seconds
let seconds = date_ob.getSeconds();

// prints date & time in YYYY-MM-DD format
//console.log(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);


var timeDiff=(new Date() -fs.statSync("C:/Users/503188394/Projects/26.06.2020/socket-example-master/socket-example-master/socket-server/src/log1.txt").mtime.getTime())/1000;

console.log(timeDiff);