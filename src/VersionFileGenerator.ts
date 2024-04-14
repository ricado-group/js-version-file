import * as path from "path";
import * as ejs from "ejs";
import * as fs from "fs";

/**
 * Data passed to EJS render function.
 *
 * @public
 */
export interface IVersionFileData
{
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
export interface IVersionFileConfigOptions
{
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

interface IPackageJson
{
    name?: string;
    version?: string;
}

/**
 * Generates a verson file with based on a package.json file.
 * Usually used during the build stage of an App release to a public
 * assets folder.
 *
 * @public
 */
export class VersionFileGenerator
{
    private _options: IVersionFileConfigOptions;
    private _data: IVersionFileData;

    public constructor(options: IVersionFileConfigOptions)
    {
        this._options = options;

        const filePath = path.join(process.cwd(), this._options.packageFile);

        try
        {
            const packageJsonString = fs.readFileSync(filePath, {
                encoding: 'utf8'
            });

            const packageJson = JSON.parse(packageJsonString) as IPackageJson;

            if('name' in packageJson === false || typeof packageJson.name !== 'string' || packageJson.name.length === 0)
            {
                throw new Error("Version File Generator: Missing the `name` property in `package.json` file");
            }

            if('version' in packageJson === false || typeof packageJson.version !== 'string' || packageJson.version.length === 0)
            {
                throw new Error("Version File Generator: Missing the `version` property in `package.json` file");
            }

            this._data = {
                name: packageJson.name,
                buildDate: new Date(),
                version: packageJson.version,
            };
        }
        catch (error)
        {
            console.log(error);
            throw new Error("Version File Generator: Error loading `package.json` file");
        }
    }

    /**
     * Renders the template and writes the version file to the file system.
     */
    private renderTemplate(templatePath: string): void
    {
        try
        {
            const fileContents = fs.readFileSync(templatePath, {
                encoding: 'utf8',
            });

            const renderedContent: string = ejs.render(fileContents, this._data);

            if(!fs.existsSync(path.dirname(this._options.outputFile)))
            {
                fs.mkdirSync(path.dirname(this._options.outputFile), {
                    recursive: true
                });
            }

            fs.writeFileSync(this._options.outputFile, renderedContent, {
                encoding: 'utf8',
                flag: 'w+',
            });
        }
        catch (error)
        {
            if(typeof error === 'object' && error !== null && 'code' in error && typeof error.code === 'string')
            {
                if(error.code === "ENOENT")
                {
                    console.error("Error: The template path you specified may not exist.");
                }
                else if('message' in error && typeof error.message === 'string')
                {
                    console.error(error.message);
                }
            }

            throw error;
        }
    }

    private renderTemplateString(templateString: string): void
    {
        const fileContents: string = ejs.render(templateString, this._data);

        if(!fs.existsSync(path.dirname(this._options.outputFile)))
        {
            fs.mkdirSync(path.dirname(this._options.outputFile), {
                recursive: true
            });
        }

        fs.writeFileSync(this._options.outputFile, fileContents, {
            encoding: 'utf8',
            flag: 'w+',
        });
    }

    /**
     * Generate a version file from the {@link IVersionFileConfigOptions}.
     * If we are given a template string in the config, then use it directly.
     * But if we get a file path, fetch the content then use it.
     */
    public generate(): void
    {
        if (fs.existsSync(this._options.template))
        {
            this.renderTemplate(this._options.template);
        }
        else
        {
            this.renderTemplateString(this._options.template);
        }
    }
}
