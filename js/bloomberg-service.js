import { connect } from '@openfin/bloomberg';
import { terminal } from '@openfin/bloomberg/terminal';

// Send updates to Terminal panel 1 and ignore group updates
export async function initBloombegConnection() {
    const bloombergConnection = await connect(null, 1, console.log, console.error);
}

export function setSecurity(security) {
    return bloombergConnection.setSecurity(`${security} Corp`);
}

export function runCommand(command, cusip) {
    return terminal.runFunction(command, 1, `${cusip} Corp`);
}