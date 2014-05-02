var packageFile = require('./package.json'),
    fs = require('fs');

var versionFile = module.exports = function(filePath){
    var currentTime = (new Date()),
        name = packageFile.name,
        version = packageFile.version,
        fileContent;

    filePath = filePath || 'version.txt';

    fileContent = name + ' v' + version + '\n';
    fileContent += 'Build date: ' + currentTime;

    fs.writeFile('version.txt', fileContent, {flag: 'w'});

};