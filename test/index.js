var fs = require("fs");
var chai = require("chai");
var expect = chai.expect;
var VersionFile = require("../index");

before(function () {
    fs.writeFileSync(__dirname + "/mine.txt", "");
    fs.writeFileSync(__dirname + "/../version.txt", "");
})

after(function () {
  fs.unlink(__dirname + "/mine.txt", (_) => {});
  fs.unlink(__dirname + "/../version.txt", (_) => {});
});

describe("version-file", function () {
  it('should generate a file called "version.txt" if called without arguments', function (done) {
    const versionFile = new VersionFile();
    versionFile.generate();
    fs.access(__dirname + "/../version.txt", function (err) {
      expect(err).to.be.null;
      done();
    });
  });

  it('should write a file in the specified location + filename given by the "outputFile" property', function (done) {
    var configObject = {
      outputFile: __dirname + "/mine.txt",
    };
    const versionFile = new VersionFile(configObject);
    versionFile.generate();
    fs.access(configObject.outputFile, function (err) {
      expect(err).to.be.null;
      done();
    });
  });

  it('should use an external file as a custom template if specified by "template"', function (done) {
    var configObject = {
      template: __dirname + "/fixtures/template.ejs",
    };
    const versionFile = new VersionFile(configObject);
    versionFile.generate();
    fs.readFile(
      __dirname + "/../version.txt",
      { encoding: "utf8" },
      function (error, content) {
        expect(error).to.be.null;
        expect(content).to.be.equal("This is a test template");
        done();
      }
    );
  });

  it('should use an inline template specified by "templateString"', function (done) {
    var configObject = {
      templateString: "Hello, world!",
    };
    const versionFile = new VersionFile(configObject);
    versionFile.generate();
    fs.readFile(
      __dirname + "/../version.txt",
      { encoding: "utf8" },
      function (error, content) {
        expect(error).to.be.null;
        expect(content).to.be.equal("Hello, world!");
        done();
      }
    );
  });
});
