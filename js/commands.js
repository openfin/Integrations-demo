import { setSecurity, runCommand } from "./bloomberg-service.js";

const supportedBbgCommands = ["BXT", "SXT", "YAS", "DES", "YASQ", "PSU", "PSU1", "QMGR", "HDS", "COV", "ATS"];
const supportedChatClientCommands = ["Symphony", "MS Teams", "Slack"];

export function setupCommandActions(params) {
    const cusip = params.node.data.CUSIP;
    const commandActions = {};

    supportedBbgCommands.forEach(command => {
        commandActions[command] = {
            name: command,
            action: function () {
                runCommand(command, cusip);
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