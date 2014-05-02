var packageFile = require('./package.json'),
    fs = require('fs'),
    _ = require('underscore'),
    ejs = require('ejs');

var versionFile = module.exports = function(configObject){
    var currentTime = (new Date()),
        name = packageFile.name,
        version = packageFile.version,
        fileContent;

    var defaultConfig = {
        pathToOutputFile: './version.txt',
        pathToTemplate: 'version.ejs',
        templateString: '',
        extras: {}
    };

    //set default config data
    configObject = configObject || {};
    configObject = _.defaults(configObject, defaultConfig);

    // If we are given a template string in the config, then use it directly.
    // But if we get a file path, fetch the content then use it.
    if(configObject.templateString){
        writeFile(configObject.templateString);
    }else{
        fs.readFile(configObject.pathToTemplate, {encoding: 'utf8'}, function(error, content){

            if(error){
                throw error;
                return;
            }

            writeFile(content);
        });
    }

    /**
     * Renders the template and writes the version file to the file system.
     * @param templateContent
     */
    var writeFile = function(templateContent){
        fileContent = ejs.render(templateContent, {'name': name, 'version': version, 'time': currentTime, extras: configObject.exports});
        console.log(fileContent);
        fs.writeFile(configObject.pathToOutputFile, fileContent, {flag: 'w'});
    }

};

versionFile();