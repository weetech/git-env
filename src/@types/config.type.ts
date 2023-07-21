interface BaseConfig {
  access_token: string
  repo: string
  branch?: string | undefined
  file_path?: string | undefined
}

export interface GithubConfig extends BaseConfig {
  owner: string
}

export interface GitlabConfig extends BaseConfig {
  host_url?: string | undefined
}

export interface BitbucketConfig extends BaseConfig {
  workspace: string
}
