import { connect, getInstrumentCodeFromSecurity } from '@openfin/bloomberg';
import { terminal } from '@openfin/bloomberg/terminal';

let bloombergConnection;

// Send updates to Terminal panel 1 and ignore group updates
export async function initBloombegConnection(updateGrid) {
    bloombergConnection = await connect(null, 1, console.log, console.error);
    const conn2 = await connect('Group-A', null, (security) => {
        const ticker = getInstrumentCodeFromSecurity(security);
        updateGrid(ticker);
    }, console.error);
}

export function setSecurity(security) {
    return bloombergConnection.setSecurity(`${security} Corp`);
}

export function runCommand(command, cusip) {
    return terminal.runFunction(command, 1, `${cusip} Corp`);
}