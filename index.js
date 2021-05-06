"use strict";

const fs = require("fs");
const path = require("path");
const _ = require("underscore");
const ejs = require("ejs");
const chalk = require("chalk");

function VersionFile(options) {
  var self = this;

  var defaultOptions = {
    outputFile: "version.txt",
    template: "version.ejs",
    templateString: "",
    packageFile: path.join(process.cwd(), "package.json"),
  };

  //Set default config data
  var optionsObject = options || {};
  self.options = _.defaults(optionsObject, defaultOptions);

  // Check for missing arguments
  if (!this.options.packageFile) {
    throw new Error(chalk.red("Expected path to packageFile"));
  }

  try {
    self.options["package"] = require(self.options.packageFile);
  } catch (err) {
    throw new Error(chalk.red(err));
  }
}

VersionFile.prototype.generate = function () {
  var self = this;
  self.options.currentTime = new Date();

  /*
   * If we are given a template string in the config, then use it directly.
   * But if we get a file path, fetch the content then use it.
   */
  if (self.options.templateString) {
    self._writeFile(self.options.templateString);
  } else {
    fs.readFile(
      self.options.template,
      {
        encoding: "utf8",
      },
      function (error, content) {
        if (error) {
          console.error(
            error.code === "ENOENT"
              ? "Error: The template path you specified may not exist."
              : error.message
          );
          throw error;
        }

        self._writeFile(content);
      }
    );
  }
};

/**
 * Renders the template and writes the version file to the file system.
 * @param templateContent
 */
VersionFile.prototype._writeFile = function (templateContent) {
  var self = this;
  var fileContent = ejs.render(templateContent, self.options);
  self._ensureDirExists(path.dirname(self.options.outputFile));
  fs.writeFileSync(self.options.outputFile, fileContent, {
    flag: "w",
  });
};

VersionFile.prototype._ensureDirExists = function (dirpath) {
  try {
    fs.mkdirSync(dirpath, { recursive: true });
  } catch (err) {
    if (err.code !== "EEXIST") throw err;
  }
};

module.exports = VersionFile;
