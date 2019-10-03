
const core = require('@actions/core');
const exec = require('@actions/exec');

async function run() {
    try {
        await exec.exec('pwsh', [ '-c', 'Write-Host $pwd' ]);
    } catch (error) {
        core.setFailed(error.message);
    }
}
run();
