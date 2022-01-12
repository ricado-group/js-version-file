import meow from "meow";
import chalk from "chalk";

import {
  VersionFileGenerator,
  IVersionFileConfigOptions,
} from "./VersionFileGenerator";

const defaultTemplate: string = `
{
  "name":      "<%= name %>",
  "buildDate": "<%= buildDate %>",
  "version":   "<%= version %>"
}
`;

interface IFlags {
  packageFile: string;
  template: string;
  outputFile: string;
}

// Command line definition.
const cli: { flags: IFlags } = meow(
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
        alias: "p",
        default: "./package.json",
      },
      template: {
        type: "string",
        alias: "t",
        default: defaultTemplate,
      },
      outputFile: {
        type: "string",
        alias: "o",
        isRequired: true,
      },
    },
    importMeta: import.meta
  }
);

// User inputs read by the terminal
const { packageFile, template, outputFile } = cli.flags;

Promise.resolve()
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
 */
function generateVersionFile(options: IVersionFileConfigOptions): void {
  const versionFileGenerator = new VersionFileGenerator(options);
  versionFileGenerator.generate();
}
