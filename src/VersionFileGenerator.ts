import { Encoding, FileSystem } from "@rushstack/node-core-library";
import * as path from "path";
import * as ejs from "ejs";
import chalk from "chalk";

/**
 * Data passed to EJS render function.
 *
 * @public
 */
export interface IVersionFileData {
  /**
   * The `package.json` name field.
   */
  name: string;
  /**
   * The date the version file was generated.
   */
  buildDate: Date;
  /**
   * The `package.json` version field.
   */
  version: string;
}

/**
 * Available Configuration Options for the {@link VersionFileGenerator}.
 *
 * @public
 */
export interface IVersionFileConfigOptions {
  /**
   * The path and filename of where to store the output
   */
  outputFile: string;
  /**
   * The path to your template file (`.ejs`) or
   * a {@link https://www.npmjs.org/package/ejs | EJS} template string.
   */
  template: string;
  /**
   * The path to the `package.json`.
   */
  packageFile: string;
}

/**
 * Generates a verson file with based on a package.json file.
 * Usually used during the build stage of an App release to a public
 * assets folder.
 *
 * @public
 */
export class VersionFileGenerator {
  private _options: IVersionFileConfigOptions;
  private _data: IVersionFileData;

  public constructor(options: IVersionFileConfigOptions) {
    this._options = options;
    try {
      const packageJSON = require(path.join(
        process.cwd(),
        this._options.packageFile
      ));
      this._data = {
        name: packageJSON.name,
        buildDate: new Date(),
        version: packageJSON.version,
      };
    } catch (err) {
      throw new Error(chalk.red(err));
    }
  }

  /**
   * Renders the template and writes the version file to the file system.
   */
  private _renderTemplate(templatePath: string): void {
    try {
      const fileContents = FileSystem.readFile(templatePath, {
        encoding: Encoding.Utf8,
      });
      const renderedContent: string = ejs.render(fileContents, this._data);
      FileSystem.writeFile(this._options.outputFile, renderedContent, {
        encoding: Encoding.Utf8,
        ensureFolderExists: true,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(
        error.code === "ENOENT"
          ? "Error: The template path you specified may not exist."
          : error.message
      );
      throw error;
    }
  }

  private _renderTemplateString(templateString: string): void {
    const fileContents: string = ejs.render(templateString, this._data);
    FileSystem.writeFile(this._options.outputFile, fileContents, {
      encoding: Encoding.Utf8,
      ensureFolderExists: true,
    });
  }

  /**
   * Generate a version file from the {@link IVersionFileConfigOptions}.
   * If we are given a template string in the config, then use it directly.
   * But if we get a file path, fetch the content then use it.
   */
  public generate(): void {
    if (FileSystem.exists(this._options.template)) {
      this._renderTemplate(this._options.template);
    } else {
      this._renderTemplateString(this._options.template);
    }
  }
}
