
const core = require('@actions/core');
const exec = require('@actions/exec');
//const github = require('@actions/github');

async function run() {
  try {
    const gist_token = core.getInput('gist_token');
    const version_key = core.getInput('version_key');

    await exec.exec('pwsh', ['-f', 'build-num.ps1']);

  /*
    const octokit = new github.GitHub(github_token);

    core.setOutput("build_num", "99");
    core.exportVariable('BUILD_NUM', '99');

    /*
    const time = (new Date()).toTimeString();
    core.setOutput("time", time);
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);
    */
  } catch (error) {
    core.setFailed(error.message);
  }
}
  
run();
