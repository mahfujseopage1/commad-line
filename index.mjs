import { spawn } from 'child_process';
import notifier, { NotificationCenter } from 'node-notifier';


const path = 'C:\\laragon\\www\\seopage1_erp';
const command = 'sonar-scanner.bat';

export const runCommand = async () => {
  try {
    sendNotification("SonarQube", "Sonar Qube Scanning Started");
    const child = spawn(command, [], {
      stdio: 'inherit',
      shell: true,
      cwd: path
    });

    child.on('exit', (code) => {
      console.log(`Child process exited with code ${code}`);
      if (code === 0) {
        sendNotification("SonarQube", "Sonar Qube Scanning Completed");
      } else {
        sendNotification("Error SonarQube", "Sonar Qube Scanning Failed");
      }
    });

  } catch (error) {
    console.log(error);
    sendNotification("Error SonarQube", "Sonar Qube Scanning Failed");
  }
}

const sendNotification = (title, message) => {
  notifier.notify({
    title: title,
    message: message,
    icon: './img/sonar.png',
    sound: true,
  });
}




