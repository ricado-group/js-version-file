# RICADO Version File Generator

Generates a `version.json` file containing data extracted from the `package.json` file. 

This file is usually generated during the build stage of an App release to a public assets folder such as `/public` or `/static`. 

A Web App can later request this file (with a polling interval) to detect when a new version of the App has become available.

_Inspired by [morficus/version-file](https://github.com/morficus/version-file)._

## Sample outfile file content
```json
{
  "version" : {
    "name":      "My React App",
    "buildDate": "Mon Nov 23 2019 14:26:25 GMT+0100 (CET)",
    "version":   "1.37.0"
  }
}
```

## Config options:

| Property        | Type   | Description                                                                                            |
| --------------- |:------:| -------------------------------------------------------------------------------------------------------|
| outputFile      | string | The path and filename of where to store the output                                                     |
| template        | string | The path to your template file (`.ejs`) or a [EJS](https://www.npmjs.org/package/ejs) template string  |
| packageFile     | string | The path to your package.json                                                                          |

## Templating

This modules uses [EJS](https://www.npmjs.org/package/ejs) as its templating system.
As indicated in the config options section, you can utilize your own template by either (a) passing in a path to an external file or (b) typing the template in-line.

## Sample Usage:

```js
import * as path from 'path';
import { VersionFileGenerator } from '@ricado/version-file';

function generateVersionFile() {
  const generator = new VersionFileGenerator({
    packageFile: path.join(__dirname, 'package.json'),
    template: path.join(__dirname, '../lib/version.ejs'),
    outputFile: path.join(__dirname, 'build/version.json'),
  });
  generator.generate();
}

generateVersionFile();
```

## CLI

A CLI tool is also available to conveniently generate a version file.   

### CLI Options

If options are not provided, defaults listed as below will apply:

```js
  --packageFile,  -p  Path to package.json file // defaults to <rootDir>/package.json
  --template,     -t  Path to template file     // defaults to a version.ejs template
  --outputFile,   -o  Path to output file       // defaults to a ./build/version.json
```

### Using as an NPM script

An example of overwriting the default `outputFile` path.

```json
{
  "scripts": {
    // ...
    "version-file": "generate-version --outputFile ./build/version.json"
  }
}

```