version-file
============

Generates a file with your package name, version and build date.

## Use case
The intention of this module is to provide insight into when a certain version of an app was deployed (typically web apps).  

For example, lets say you are working on a team of where not everyone has access to the source code or the ability to trigger deployments (like designers, testers, marketers, project managers, etc).  
At some point, one of these folks might need to know when the latest version of something was deployed (either to answer a customers question or compare environments or what have you).  
By taking a glace and the version.txt file in their browser, they can quickly get that type of information with out having to disrupt the busy developers or waiting for somebody to get back to them.

## Sample outfile file content

    version-file v0.1.0
    Build date: Fri May 02 2014 00:10:42 GMT-0400 (EDT)


## Available config options:
(these are all optional)

- pathToOutputFile: where you write the file content, includes the file name (defaults to 'version.txt' in the root directory')
- pathToTemplate: file path to an external EJS template file
- templateString: a raw template string to be used in the file output (available as an alternative to using an external template file)
- extras: an object intended to hold any additional data you wish to utilize in your templating (see the template section for more details)

## Templating

This modules uses [EJS](https://www.npmjs.org/package/ejs) as its templating system.
As indicated in the config options section, you can utilize your own template by either (a) passing in a path to an external file or (b) typing the template in-line.

The available options are:

- name: the package name (based off the content of your package.json file)
- version: the version number (also based off the content of your package.json file)
- time: a human-readable time stamp
- extras: an object containing any custom / additional data that is needed in the template

### Sample template:

```
<%= name %> v<%= version %>
Build date: <%= time %>

<%= extras.teamName %>
```