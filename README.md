# vscode-api-runner

This is an extension for Microsoft Visual Studio Code (VSCode), which provides an HTTP interface to run VSCode API commands.


## Features

VSCode and its extensions provide various functions as APIs.
However, users do not have direct access to the APIs and usually need to use them through command palettes.

To solve this problem, this extension provides direct access to the API via HTTP.
Specifically, this extension sets up an HTTP server and listens to a specified port (default: `9607`) of `localhost.`
When the server receives a string, which represents some API, this extension calls that API internally.

Accordingly, you can call any VSCode API without using command pallettes.
This means you can manipulate VSCode from a command line and automate series of actions with some simple shellscript.


## Examples

The server receives HTTP requests which include JSON string.
The JSON string needs `"cmd"` and `"args"` properties, which means an API command and its arguments, respectively.

Here are some examples:
- Open configuration
```
$ curl \
  -X POST \
  -H "Content-Type: application/json" \
  http://localhost:9607 \
  -d '{ "cmd": "workbench.action.openSettingsJson", "args": "" }'
```

- Open folder
```
$ curl \
  -X POST \
  -H "Content-Type: application/json" \
  http://localhost:9607 \
  -d '{ "cmd": "vscode.openFolder", "args": { "scheme": "file", "path": "/usr/local/bin", "$mid": 1 } }'
```

- Find available commands which include a keyword "open"
```
$ curl \
  -X POST \
  -H "Content-Type: application/json" \
  http://localhost:9607 \
  -d '{ "cmd": "find", "args": "open" }'
```

## Extension Settings

This extension contributes the following settings:
- `vscodeApiRunner.port`: port number on which the server listens.


## LICENSE
MIT
