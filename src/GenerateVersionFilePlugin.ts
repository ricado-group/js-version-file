import * as Webpack from "webpack";
import {
  IVersionFileConfigOptions,
  VersionFileGenerator,
} from "./VersionFileGenerator";

const PLUGIN_NAME: string = "generate-version-file";
const DEFAULT_TEMPLATE: string = `
{
  "name":      "<%= name %>",
  "buildDate": "<%= buildDate %>",
  "version":   "<%= version %>"
}
`;

/**
 * A Webpack plugin for generating a `version.json` file.
 *
 * @remarks
 * A simple Webpack Plugin that generates a 'version.json' file containing version information
 * extracted from the apps package.json file. In production, an app can poll this file
 * to detect and notify the user of any new releases.
 *
 * @public
 */
export class GenerateVersionFilePlugin
  implements Webpack.WebpackPluginInstance {
  public static defaultOptions: IVersionFileConfigOptions = {
    packageFile: "./package.json",
    template: DEFAULT_TEMPLATE,
    outputFile: "./build/version.json",
  };
  public options: IVersionFileConfigOptions;

  public constructor(options: IVersionFileConfigOptions) {
    this.options = { ...GenerateVersionFilePlugin.defaultOptions, ...options };
  }

  public apply(compiler: Webpack.Compiler): void {
    const isWebpack5: boolean = !!compiler.hooks;

    if (!isWebpack5) {
      throw new Error(
        `The ${GenerateVersionFilePlugin.name} plugin requires Webpack 5`
      );
    }

    compiler.hooks.afterEmit.tapAsync(PLUGIN_NAME, (compilation, callback) => {
      const generator = new VersionFileGenerator(this.options);
      generator.generate();
      callback();
    });
  }
}
