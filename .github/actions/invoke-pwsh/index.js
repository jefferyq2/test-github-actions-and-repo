
const core = require('@actions/core');
const exec = require('@actions/exec');

async function run() {
    try {
        await exec.exec('pwsh', [ '-c', '"Write-Host \'***** Current Directory:\'"' ]);
        await exec.exec('pwsh', [ '-c', '"Write-Host $pwd"' ]);
        await exec.exec('pwsh', [ '-c', '"Write-Host \'***** List Directory:\'"' ]);
        await exec.exec('pwsh', [ '-c', '"Get-ChildItem ."' ]);
        await exec.exec('pwsh', [ '-c', '"Write-Host \'***** List Environment:\'"' ]);
        await exec.exec('pwsh', [ '-c', '"Get-ChildItem env:"' ]);
    } catch (error) {
        core.setFailed(error.message);
    }
}
run();
