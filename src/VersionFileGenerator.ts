import { Encoding, FileSystem } from "@rushstack/node-core-library";
import * as path from "path";
import * as ejs from "ejs";
import _ from "underscore";
import chalk from "chalk";

/**
 * Data passed to EJS render function.
 *
 * @public
 */
export interface IVersionFileData {
  name: string;
  buildDate: Date;
  version: string;
}

/**
 * Available Configuration Options for the {@link VersionFileGenerator}.
 *
 * @public
 */
export interface IVersionFileConfigOptions {
  outputFile: string;
  template: string;
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

  public constructor(options?: Partial<IVersionFileConfigOptions>) {
    this._options = _.defaults(options, {
      outputFile: "./build/version.json",
      template: `
{
  "name":      "<%= name %>",
  "buildDate": "<%= buildDate %>",
  "version":   "<%= version %>"
}
`,
      packageFile: "./package.json",
    });
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
  private async _renderTemplate(templatePath: string): Promise<void> {
    try {
      const fileContents = await FileSystem.readFileAsync(templatePath, {
        encoding: Encoding.Utf8,
      });
      const renderedContent: string = ejs.render(fileContents, this._data);
      return FileSystem.writeFileAsync(this._options.outputFile, renderedContent, {
        encoding: Encoding.Utf8,
        ensureFolderExists: true,
      });
    } catch (error) {
      console.error(
        error.code === "ENOENT"
          ? "Error: The template path you specified may not exist."
          : error.message
      );
      throw error;
    }
  }

  private async _renderTemplateString(templateString: string): Promise<void> {
    const fileContents: string = ejs.render(templateString, this._data);
    return FileSystem.writeFileAsync(this._options.outputFile, fileContents, {
      encoding: Encoding.Utf8,
      ensureFolderExists: true,
    });
  }

  /**
   * Generate a version file from the {@link IVersionFileConfigOptions}.
   */
  public async generate(): Promise<void> {
    /*
     * If we are given a template string in the config, then use it directly.
     * But if we get a file path, fetch the content then use it.
     */
    const exists = FileSystem.exists(this._options.template);
    if (exists) {
      return this._renderTemplate(this._options.template);
    } else {
      return this._renderTemplateString(this._options.template);
    }
  }
}