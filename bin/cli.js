#!/usr/bin/env node
"use strict";

const fs = require("fs");
const meow = require("meow");
const VersionFile = require("../index");
const chalk = require("chalk");
const path = require("path");

// Package root directory
const libRoot = path.join(path.dirname(fs.realpathSync(__filename)), "../");
const appRoot = process.cwd();

// Command line definition.
const cli = meow(
  `
  Usage
    $ generate-version <package.json> <template.ejs> <output_file.json>

  Options
    --packageFile,  -p  Path to package.json file
    --template,     -t  Path to template file
    --outputFile,   -o  Path to output file

  Examples
    $ generate-version -p ./package.json -t ./templates/version.ejs -o ./build/version.json
`,
  {
    flags: {
      packageFile: {
        type: "string",
        default: path.join(appRoot, "./package.json"),
        alias: "p",
      },
      template: {
        type: "string",
        default: path.join(libRoot, "version.ejs"),
        alias: "t",
      },
      outputFile: {
        type: "string",
        alias: "o",
      },
    },
  }
);

// User inputs read by the terminal
const { packageFile, template, outputFile } = cli.flags;

Promise.resolve()
  .then(() => outputFile || Promise.reject("The output file path is required."))
  .then(() =>
    generateVersionFile({
      packageFile,
      template,
      outputFile,
    })
  )
  .catch((error) => {
    throw new Error(chalk.red(error));
  });

/**
 * Generate Version File.
 *
 * This is used to generate a file containing version information,
 * based on the information in your NPM package.json.
 * This file is used to display the version
 * number at the bottom of the app.
 *
 */
function generateVersionFile(options) {
  const versionFile = new VersionFile(options);
  versionFile.generate();
}
