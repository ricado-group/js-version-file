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
        pathToOutputFile: __dirname + '/version.txt',
        pathToTemplate: 'version.ejs',
        templateString: '',
        extras: {}
    };


    /**
     * Renders the template and writes the version file to the file system.
     * @param templateContent
     */
    var writeFile = function(templateContent){
        fileContent = ejs.render(templateContent, {'name': name, 'version': version, 'time': currentTime, extras: configObject.extras});
        fs.writeFileSync(configObject.pathToOutputFile, fileContent, {flag: 'w'});
    }
    
    //set default config data
    configObject = configObject || {};
    configObject = _.defaults(configObject, defaultConfig);

    // If we are given a template string in the config, then use it directly.
    // But if we get a file path, fetch the content then use it.
    if(configObject.templateString){
        writeFile(configObject.templateString);
    }else{
        var content = fs.readFileSync(configObject.pathToTemplate, {encoding: 'utf8'});
            writeFile(content);
    }


};
