import { Octokit } from 'octokit'
import PLATFORM, { Optional } from './@types/platform.type'
import ConfigOptions from './@types/config-options.type'
import { BitbucketConfig, GithubConfig, GitlabConfig } from './@types/config.type'

async function fetchRawFile(platform: PLATFORM, config: Optional<ConfigOptions['config']>): Promise<string> {
  switch (platform) {
    case PLATFORM.GITLAB:
      return (
        await fetch(
          `${(config as GitlabConfig)?.host_url ?? 'https://gitlab.com'}/api/v4/projects/${config?.repo}/repository/files/${encodeURIComponent(
            config?.file_path ?? '.env'
          )}/raw?ref=${config?.branch ?? 'main'}`,
          {
            method: 'GET',
            headers: { 'PRIVATE-TOKEN': config?.access_token ?? '' },
          }
        )
      ).text()
    case PLATFORM.GITHUB:
      const octokit = new Octokit({
        auth: config?.access_token,
      })

      const res = await octokit.request(`GET /repos/{owner}/{repo}/contents/{path}${config?.branch ? '?ref={ref}' : ''}`, {
        owner: (config as GithubConfig)?.owner,
        repo: config?.repo,
        path: config?.file_path,
        ref: config?.branch,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      })
      return atob(res.data.content ?? '')
    case PLATFORM.BITBUCKET:
      const latestCommitHash = (
        await (
          await fetch(
            `https://api.bitbucket.org/2.0/repositories/${(config as BitbucketConfig)?.workspace}/${config?.repo}/commits/?include=${config?.branch}`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${config?.access_token}`,
                Accept: 'application/json',
              },
            }
          )
        ).json()
      ).values[0].hash

      return (
        await fetch(
          `https://api.bitbucket.org/2.0/repositories/${(config as BitbucketConfig)?.workspace}/${config?.repo}/src/${latestCommitHash}/${config?.file_path}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${config?.access_token}`,
              Accept: 'application/json',
            },
          }
        )
      ).text()
    default:
      throw Error('Provide a Valid Host')
  }
}
export default fetchRawFile
