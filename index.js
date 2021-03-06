const core = require('@actions/core');
const { GitHub, context } = require('@actions/github');

const main = async () => {
  const {repo, owner} = context.repo;
  const githubToken = core.getInput('github-token');
  const coverage = core.getInput('coverage');
  console.log({githubToken, coverage});

  const githubClient = new GitHub(githubToken);
  const result = await githubClient.repos.listPullRequestsAssociatedWithCommit({
    repo, owner, commit_sha: context.sha
  });
  if (!result.data || !result.data.length) {
    return true;
  }
  const issue_number = result.data[0].number;
  const percentage = JSON.parse(coverage).result.covered_percent;
  const body = `<p>Total Coverage: <code>${percentage}</code>`;

  await githubClient.issues.createComment({repo, owner, body, issue_number});
};

main().catch(err => core.setFailed(err.message));
