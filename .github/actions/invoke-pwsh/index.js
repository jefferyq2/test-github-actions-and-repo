
const core = require('@actions/core');
const exec = require('@actions/exec');

async function run() {
    try {
        await exec.exec('pwsh', [ '-c', '"Write-Output \'***** Current Directory:\'"' ]);
        await exec.exec('pwsh', [ '-c', '"Write-Output \\$pwd"' ]);
        await exec.exec('pwsh', [ '-c', '"Write-Output \'***** List Directory:\'"' ]);
        await exec.exec('pwsh', [ '-c', '"Get-ChildItem | % { Write-Warning \\$_ }"' ]);
        await exec.exec('pwsh', [ '-c', '"Write-Host \'***** List Environment:\'"' ]);
        await exec.exec('pwsh', [ '-c', '" Get-ChildItem env: | % { Write-Warning "\\$(\\$_.Key) = \\$(\\$_.Value)" }"' ]);
    } catch (error) {
        core.setFailed(error.message);
    }
}
run();
