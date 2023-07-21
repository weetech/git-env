import { BitbucketConfig, GithubConfig, GitlabConfig } from './config.type'
import PLATFORM from './platform.type'

type ConfigOptions =
  | {
      platform: PLATFORM.BITBUCKET
      config?: BitbucketConfig
    }
  | {
      platform: PLATFORM.GITHUB
      config?: GithubConfig
    }
  | {
      platform: PLATFORM.GITLAB
      config?: GitlabConfig
    }

export default ConfigOptions
