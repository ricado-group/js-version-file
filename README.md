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

| Property        | Type   | Description                                                 |
| --------------- |:------:| ------------------------------------------------------------|
| outputFile      | string | The path and filename of where to store the output          |
| template        | string | The path to your template file (`.ejs`)                     |
| templateString  | string | An [EJS](https://www.npmjs.org/package/ejs) template string |
| packageFile     | string | The path to your package.json                               |

## Templating

This modules uses [EJS](https://www.npmjs.org/package/ejs) as its templating system.
As indicated in the config options section, you can utilize your own template by either (a) passing in a path to an external file or (b) typing the template in-line.

The available options are:

- package: contains all keys of your package.json
- buildDate: a human-readable time stamp
- extras: an object containing any custom / additional data that is needed in the template

## Sample Usage:

```js
import * as path from 'path';
import VersionFile from '@ricado/version-file';

function generateVersionFile() {
  const versionFile = new VersionFile({
    packageFile: path.join(appRoot, 'package.json'),
    template: path.join(__dirname, '../lib/version.ejs'),
    outputFile: path.join(appRoot, 'build/version.json'),
    extras: {
      timestamp: Date.now(),
    }
  });
  versionFile.generate();
}

generateVersionFile();
```

## CLI

A CLI tool is also available to conveniently generate a version file.   

### CLI Options

```js
  --packageFile,  -p  Path to package.json file // defaults to <rootDir>/package.json
  --template,     -t  Path to template file     // defaults to a version.ejs template
  --outputFile,   -o  Path to output file       // required
```

### Using as an NPM script

```json
{
  "scripts": {
    // ...
    "version-file": "generate-version --outputFile ./build/version.json"
  }
}

```