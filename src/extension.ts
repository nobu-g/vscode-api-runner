// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as http from "http";
import { ServerResponse } from "node:http";

const logger = (fun: CallableFunction) =>
  console.log(`[${new Date()}] ${fun.call(null)}`);

const server = http.createServer(
  (request: http.IncomingMessage, response: http.ServerResponse) => {
    request.on("data", (chunk) => {
      logger(() => `received data[${chunk}]`);
      const data = JSON.parse(chunk);
      if (data["cmd"] === "list") {
        vscode.commands.getCommands(false).then((cmds: String[]) => {
          console.log(cmds);
          response.end(JSON.stringify(cmds));
        });
      } else {
        // https://github.com/microsoft/vscode-remote-release/issues/3552#issuecomment-732414007
        vscode.commands.executeCommand(data["cmd"], data["args"]);
        response.end();
      }
    });
  }
);

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  // console.log('Congratulations, your extension "vscode-api-runner" is now active!');

  server.listen("4000");
  logger(() => "Server startup");

  // 	// The command has been defined in the package.json file
  // 	// Now provide the implementation of the command with registerCommand
  // 	// The commandId parameter must match the command field in package.json
  // 	let disposable = vscode.commands.registerCommand('vscode-api-runner.helloWorld', () => {
  // 		// The code you place here will be executed every time your command is executed

  // 		// Display a message box to the user
  // 		vscode.window.showInformationMessage('Hello World from vscode-api-runner!');
  // 	});

  // 	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export const deactivate = () => {
  server.close();
  logger(() => "Server shutdown");
};

// システムのコマンドはここから探す
// https://code.visualstudio.com/docs/getstarted/keybindings
