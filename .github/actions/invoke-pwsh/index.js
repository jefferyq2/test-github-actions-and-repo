
const core = require('@actions/core');
const exec = require('@actions/exec');

async function run() {
    try {
        await exec.exec('pwsh', [ '-c', 'Write-Output \'***** Current Directory:\'' ]);
        await exec.exec('pwsh', [ '-c', 'Write-Output $pwd' ]);
        await exec.exec('pwsh', [ '-c', 'Write-Output `$pwd' ]);
        await exec.exec('pwsh', [ '-c', 'Write-Output \$pwd' ]);
        await exec.exec('pwsh', [ '-c', 'Write-Output "::warning::$pwd"' ]);
        await exec.exec('pwsh', [ '-c', 'Write-Output \'***** List Directory:\'' ]);
        await exec.exec('pwsh', [ '-c', 'Get-ChildItem | % { Write-Warning $_ }' ]);
        await exec.exec('pwsh', [ '-c', 'Write-Host \'***** List Environment:\'' ]);
        await exec.exec('pwsh', [ '-c', 'Get-ChildItem env: | % { Write-Warning "$($_.Key) = $($_.Value)" }' ]);

        const list_files = core.getInput('list_files');
        if (list_files === '1') {
            var execOpts = {
                /** optional.  whether to fail if output to stderr.  defaults to false */
                failOnStdErr: false,
                /** optional.  defaults to failing on non zero.  ignore will not fail leaving it up to the caller */
                ignoreReturnCode: true
            };

            await exec.exec('bash', [ '-c', 'mkdir list_files']);
            await exec.exec('bash', [ '-c', 'find / -type f > list_files/find.out'], execOpts);
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}
run();
