import * as fs from "fs";
import {
  VersionFileGenerator,
  IVersionFileConfigOptions,
} from "../VersionFileGenerator";

afterAll(function () {
  // Clean-up generated files
  fs.unlinkSync(__dirname + "/../mine.json");
  fs.unlinkSync(__dirname + "/../../build/version.json");
});

describe("Version File Generator", function () {
  it('should generate a file called "version.json" at the <rootDir> if called without arguments', function (done: jest.DoneCallback) {
    const generator: VersionFileGenerator = new VersionFileGenerator();
    generator.generate();
    fs.access(__dirname + "/../../build/version.json", function (
      err: NodeJS.ErrnoException | null
    ) {
      expect(err).toBe(null);
      done();
    });
  });

  it('should write a file in the specified location + filename given by the "outputFile" property', function (done: jest.DoneCallback) {
    const outputFile: string = __dirname + "/../mine.json";
    const configObject: Partial<IVersionFileConfigOptions> = {
      outputFile,
    };
    const generator: VersionFileGenerator = new VersionFileGenerator(
      configObject
    );
    generator.generate();
    fs.access(outputFile, function (err: NodeJS.ErrnoException | null) {
      expect(err).toBe(null);
      done();
    });
  });

  it('should use an external file as a custom template if specified by "template"', function (done: jest.DoneCallback) {
    const configObject: Partial<IVersionFileConfigOptions> = {
      template: __dirname + "/fixtures/template.ejs",
    };
    const generator: VersionFileGenerator = new VersionFileGenerator(
      configObject
    );
    generator.generate();
    fs.readFile(
      __dirname + "/../../build/version.json",
      { encoding: "utf8" },
      function (error: NodeJS.ErrnoException | null, content: string) {
        expect(error).toBe(null);
        expect(content).toBe("This is a test template");
        done();
      }
    );
  });

  it('should use an inline template specified by "templateString"', function (done: jest.DoneCallback) {
    const configObject: Partial<IVersionFileConfigOptions> = {
      template: "Hello, world!",
    };
    const generator: VersionFileGenerator = new VersionFileGenerator(
      configObject
    );
    generator.generate();
    fs.readFile(__dirname + "/../../build/version.json", { encoding: "utf8" }, function (
      error: NodeJS.ErrnoException | null,
      content: string
    ) {
      expect(error).toBe(null);
      expect(content).toBe("Hello, world!");
      done();
    });
  });
});
