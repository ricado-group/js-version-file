var fs = require('fs');
var chai = require('chai');
var expect = chai.expect;
var versionFile = require('../index');

after(function(){
    fs.unlink(__dirname + '/mine.txt');
    fs.unlink(__dirname + '/../version.txt');
});

describe('version-file', function(){
    it('should generate a file called "version.txt" if called with out arguments', function(done){
        versionFile();
        fs.exists(__dirname + '/../version.txt', function(exists){
            expect(exists).to.be.true;
            done();
        });
    });

    it('should write a file in the specified location + filename given  by the "pathToOutputFile" proeprty', function(done){
        var configObject = {
            pathToOutputFile: __dirname + '/mine.txt'
        }
        versionFile(configObject);
        fs.exists(configObject.pathToOutputFile, function(exists){
            expect(exists).to.be.true;
            done();
        });
    });

    it('should use an external file as a custom template if specified by "pathToTemplate"', function(done){
        var configObject = {
            pathToTemplate: __dirname + '/fixtures/template.ejs'
        }
        versionFile(configObject);
        fs.readFile(__dirname + '/../version.txt', {encoding: 'utf8'}, function(error, content){
            expect(error).to.be.null;
            expect(content).to.be.equal('This is a test template');
            done();
        });
    });

    it('should use an inline template specified by "templateString"', function(done){
        var configObject = {
            templateString: 'Hello, world!'
        }
        versionFile(configObject);
        fs.readFile(__dirname + '/../version.txt', {encoding: 'utf8'}, function(error, content){
            expect(error).to.be.null;
            expect(content).to.be.equal('Hello, world!');
            done();
        });
    });

    it('should include anything specified in the "extras" parameter as part of the output file', function(done){
        var configObject = {
            extras: 'Is this for real?'
        }
        versionFile(configObject);
        fs.readFile(__dirname + '/../version.txt', {encoding: 'utf8'}, function(error, content){
            expect(error).to.be.null;
            expect(content.indexOf('Is this for real?')).to.be.greaterThan(0)
            done();
        });
    });
});