const supportedBbgCommands = ["YAS", "DES", "YASQ", "PSU", "PSU1", "QMGR", "HDS", "COV", "ATS"];
const supportedChatClientCommands = ["Symphony", "MS Teams", "Slack"];

export function setupCommandActions() {
    const commandActions = {};

    supportedBbgCommands.forEach(command => {
        commandActions[command] = {
            name: command,
            action: function () {
                window.alert('Alerting about ' + command);
            }
        }
    });

    commandActions["separator"] = "separator";

    supportedChatClientCommands.forEach(command => {
        commandActions[command] = {
            name: command,
            action: function () {
                window.alert('Alerting about ' + command);
            }
        }
    });

    return commandActions;
}