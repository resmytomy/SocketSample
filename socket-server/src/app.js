const app = require('express')();
var fs = require('fs');
var watch = require('watch');
const sizeOf = require('get-folder-size');
const path = require("path");
const { dirname } = require('path');
const fileUtilObject = require('./fileutil')
const rules = require('../rules')
const http = require('http').Server(app);
const io = require('socket.io')(http);
const dir = 'C:/Users/503188394/Projects/26.06.2020/socket-example-master/socket-example-master/socket-server/Monitor/';
const backUp = 'C:/Users/503188394/Projects/26.06.2020/socket-example-master/socket-example-master/socket-server/backUpFiles/';

io.on('connection', socket => {
    let monitor = true;
    let maxSizeFile = 0;
    let maxSizeFolder = 0;
    let previousId;
    const safeJoin = currentId => {
        socket.leave(previousId);
        socket.join(currentId, () => console.log(`Socket ${socket.id} joined room ${currentId}`));
        previousId = currentId;
    }
    if (monitor) {
        watch.watchTree(dir, function (f, curr, prev) {
            if (typeof f == "object" && prev === null && curr === null) {
                // Finished walking the tree
            } else if (prev === null) {
                console.log('added', f)
                socket.emit('add', f);
                checkRule(f, socket);

            } else if (curr.nlink === 0) {
                console.log('removed', f);
            }
            else {
                console.log('changed file', f);

                checkRule(f, socket);

            }
        })
    }
    socket.on('createRule', input => {
        fileUtilObject.write('rules.js', input).then(data => checkRuleAfterRuleCreation(socket))
            .catch(errr => console.log(errr));

    });
    console.log(`Socket ${socket.id} has connected`);
});

http.listen(4444, () => {
    console.log('Listening on port 4444');
});

function moveFiletoAnotherFolder(fileName) {
    const currentPath = path.join(dir, fileName)
    const newPath = path.join(backUp, fileName)

    try {
        fs.renameSync(currentPath, newPath)
        console.log("Successfully moved the file!")
    } catch (err) {
        throw err
    }
}

function checkRule(fName, socket) {
    var last = fName.substring(fName.lastIndexOf("\\") + 1, fName.length);
    const ruleForFile = rules.find(rule => last.includes(rule.fileName));
    if (!isEmpty(ruleForFile)) {
        console.log(ruleForFile.fileName)
        var filenamemodier = ruleForFile.fileNameModifire;
        var fileSize = ruleForFile.fileSize;
        var fileOld = ruleForFile.fileOld;
        var fileNum = ruleForFile.fileNum;
        var fnameRule = ruleForFile.fileName;
        var deleteOrBackup = ruleForFile.deleteOrBackup;
        if (fileSize !== null && fileSize !== '') {
            if (fileOld !== null && fileOld !== '') {

                if (filenamemodier === 'start') {
                    if (last.startsWith(fnameRule)) {
                        var stats = fs.statSync(fName);
                        var filesizeOriginal = stats.size;
                        console.log('file size original ', filesizeOriginal)
                        var timeDiff = (new Date() - fs.statSync(fName).mtime.getTime()) / 1000;
                        console.log('time difference ', timeDiff)
                        if (filesizeOriginal >= fileSize || timeDiff >= fileOld) {
                            if (deleteOrBackup == 'delete') {
                                socket.emit('deleted', 'deleted'+fName);
                                fs.unlinkSync(fName);
                            } else if (deleteOrBackup === 'backup') {
                                socket.emit('moved', 'moved to back up '+fName);
                                moveFiletoAnotherFolder(last);
                            }
                        }

                    }
                }
                else if (filenamemodier === 'end') {
                    if (last.endsWith(fnameRule)) {
                        var stats = fs.statSync(fName);
                        var filesizeOriginal = stats.size;
                        var timeDiff = (new Date() - fs.statSync(fName).mtime.getTime()) / 1000;
                        if (filesizeOriginal >= fileSize || timeDiff >= fileOld) {
                            if (deleteOrBackup == 'delete') {
                                socket.emit('deleted', 'deleted  '+fName);
                                fs.unlinkSync(fName);
                            } else if (deleteOrBackup === 'backup') {
                                socket.emit('moved', 'moved to back up '+fName);
                                moveFiletoAnotherFolder(last);
                            }
                        }
                    }
                }
                else {
                    if (last.includes(fnameRule)) {
                        var stats = fs.statSync(fName);
                        var filesizeOriginal = stats.size;
                        var timeDiff = (new Date() - fs.statSync(fName).mtime.getTime()) / 1000;
                        if (filesizeOriginal >= fileSize || timeDiff >= fileOld) {
                            if (deleteOrBackup == 'delete') {
                                socket.emit('deleted', 'deleted  '+fName);
                                fs.unlinkSync(fName);
                            } else if (deleteOrBackup === 'backup') {
                                socket.emit('moved', 'moved to back up '+fName);

                                moveFiletoAnotherFolder(last);
                            }
                        }
                    }

                }
            }
            else {
                if (filenamemodier === 'start') {
                    if (last.startsWith(fnameRule)) {
                        var stats = fs.statSync(fName);
                        var filesizeOriginal = stats.size;
                        if (filesizeOriginal >= fileSize) {
                            if (deleteOrBackup == 'delete') {
                                socket.emit('deleted', 'deleted  '+fName);

                                fs.unlinkSync(fName);
                            } else if (deleteOrBackup === 'backup') {
                                socket.emit('moved', 'moved to back up '+fName);

                                moveFiletoAnotherFolder(last);
                            }
                        }

                    }
                }
                else if (filenamemodier === 'end') {
                    if (last.endsWith(fnameRule)) {
                        var stats = fs.statSync(fName);
                        var filesizeOriginal = stats.size;
                        if (filesizeOriginal >= fileSize) {
                            if (deleteOrBackup == 'delete') {
                                socket.emit('deleted', 'deleted  '+fName);

                                fs.unlinkSync(fName);
                            } else if (deleteOrBackup === 'backup') {
                                socket.emit('moved', 'moved to back up '+fName);

                                moveFiletoAnotherFolder(last);
                            }
                        }
                    }
                }
                else if (last.includes(fnameRule)) {
                    var stats = fs.statSync(fName);
                    var filesizeOriginal = stats.size;
                    if (filesizeOriginal >= fileSize) {
                        if (deleteOrBackup == 'delete') {
                            socket.emit('deleted', 'deleted  '+fName);

                            fs.unlinkSync(fName);
                        } else if (deleteOrBackup === 'backup') {
                            socket.emit('moved', 'moved to back up '+fName);

                            moveFiletoAnotherFolder(last);
                        }
                    }
                }
            }
        }

    }


}
function isEmpty(obj) {
    if (obj === undefined) {
        return true;
    }
    else {
        return !Object.keys(obj).length;
    }
}
function checkRuleAfterRuleCreation(socket) {

    fs.readdirSync(dir).forEach(file => {
        var strPath = dir + file;
        var corrected = strPath.split('/').join('\\')

        checkRule(corrected, socket)
    });

}
