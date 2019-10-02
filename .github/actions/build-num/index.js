
const core = require('@actions/core');
const github = require('@actions/github');

try {
    // `who-to-greet` input defined in action metadata file
    const build_name = core.getInput('build_name');
    const wiki_page = core.getInput('wiki_page');
    const github_token = core.getInput('github_token');
    
    console.log(`BUILD_NAME is:  [${build_name}]`);
    console.log(`WIKI_PAGE is: [${wiki_page}]`);

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
