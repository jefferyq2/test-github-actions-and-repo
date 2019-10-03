
const core = require('@actions/core');
const exec = require('@actions/exec');

async function run() {
    try {
        const gist_token = core.getInput('gist_token');
        const version_key = core.getInput('version_key');

        await exec.exec('pwsh', [
            '-f', './.github/actions/build-num/build-num.ps1',
            '-InformationAction', 'Continue',
            '-GitHubToken', gist_token,
            '-VersionKey', version_key,
        ]);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
