import * as fs from "fs";
import * as path from "path";
import * as ejs from "ejs";
import _ from "underscore";
import chalk from "chalk";

/**
 * @public
 */
export interface IVersionFileData {
  name: string;
  currentTime: Date;
  version: string;
}

/**
 * @public
 */
export interface IVersionFileGeneratorOptions {
  outputFile: string;
  template: string;
  templateString?: string;
  packageFile: string;
}

/**
 * @public
 */
export class VersionFileGenerator {
  private _options: IVersionFileGeneratorOptions;
  private _data: IVersionFileData;

  public constructor(options: IVersionFileGeneratorOptions) {
    this._options = {
      outputFile: "version.txt",
      template: "version.ejs",
      templateString: "",
      packageFile: path.join(process.cwd(), "package.json"),
    };
    this._options = _.defaults(options, this._options);
    try {
      const packageJSON = require(this._options.packageFile);
      this._data = {
        name: packageJSON.name,
        currentTime: new Date(),
        version: packageJSON.version,
      };
    } catch (err) {
      throw new Error(chalk.red(err));
    }
  }

  /**
   * Renders the template and writes the version file to the file system.
   * 
   * @param templateContent - contents of the version.ejs or template string.
   */
  private _writeFile(templateContent: string): void {
    const fileContents: string = ejs.render(templateContent, this._data);
    this._ensureDirExists(path.dirname(this._options.outputFile));
    fs.writeFileSync(this._options.outputFile, fileContents, {
      flag: "w",
    });
  }

  private _ensureDirExists(dirpath: string): void {
    try {
      fs.mkdirSync(dirpath, { recursive: true });
    } catch (err) {
      if (err.code !== "EEXIST") throw err;
    }
  }

  public generate(): void {
    /*
     * If we are given a template string in the config, then use it directly.
     * But if we get a file path, fetch the content then use it.
     */
    if (this._options.templateString) {
      this._writeFile(this._options.templateString);
    } else {
      fs.readFile(
        this._options.template,
        {
          encoding: "utf8",
        },
        (error: NodeJS.ErrnoException | null, content: string) => {
          if (error) {
            console.error(
              error.code === "ENOENT"
                ? "Error: The template path you specified may not exist."
                : error.message
            );
            throw error;
          }

          this._writeFile(content);
        }
      );
    }
  }
}
