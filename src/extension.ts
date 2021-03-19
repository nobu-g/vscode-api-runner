import * as vscode from 'vscode';
import * as http from 'http';

const logger = (fun: CallableFunction) =>
  console.log(`[${new Date()}] ${fun()}`);

const server = http.createServer(
  (request: http.IncomingMessage, response: http.ServerResponse) => {
    request.on('data', (chunk) => {
      logger(() => `received data[${chunk}]`);
      const data = JSON.parse(chunk);
      if (data['cmd'] === 'find') {
        vscode.commands.getCommands(false).then((cmds: string[]) => {
          console.log(cmds);
          response.end(
            cmds.filter((cmd) => cmd.indexOf(data['args']) >= 0).join('\n')
          );
        });
      } else {
        // https://github.com/microsoft/vscode-remote-release/issues/3552#issuecomment-732414007e
        // https://github.com/microsoft/vscode/issues/58#issuecomment-205370778
        vscode.commands.executeCommand(data['cmd'], data['args']);
        response.end();
      }
    });
  }
);

export function activate(context: vscode.ExtensionContext): void {
  const config = vscode.workspace.getConfiguration('vscodeApiRunner');
  const port = config.get('port');
  server.listen(port);
  logger(() => `Server startup on port: ${port}`);

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
export const deactivate = (): void => {
  server.close();
  logger(() => 'Server shutdown');
};
