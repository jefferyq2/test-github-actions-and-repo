
const core = require('@actions/core');
const exec = require('@actions/exec');

async function run() {
    try {
        await exec.exec('pwsh', [ '-c', '"Write-Host \'***** Current Directory:\'"' ]);
        await exec.exec('pwsh', [ '-c', '"Write-Host $pwd | Out-Default | Write-Host"' ]);
        await exec.exec('pwsh', [ '-c', '"Write-Host \'***** List Directory:\'"' ]);
        await exec.exec('pwsh', [ '-c', '"Get-ChildItem . | Out-Default | Write-Host"' ]);
        await exec.exec('pwsh', [ '-c', '"Write-Host \'***** List Environment:\'"' ]);
        await exec.exec('pwsh', [ '-c', '"Get-ChildItem env: | Out-Default | Write-Host"' ]);
    } catch (error) {
        core.setFailed(error.message);
    }
}
run();
