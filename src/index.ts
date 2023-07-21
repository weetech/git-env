import fetchRawFile from './fetch-raw'
import YAML from 'yaml'
import ConfigOptions from './@types/config-options.type'
import PLATFORM, { Optional } from './@types/platform.type'
import {
  ENVPrefix,
  standard,
  env_access_token_key,
  env_branch_key,
  env_file_path_key,
  env_host_url_key,
  env_owner_key,
  env_platform_key,
  env_repo_key,
  env_workspace_key,
} from './constant'
import { BitbucketConfig, GithubConfig, GitlabConfig } from './@types/config.type'

export default class GitENV {
  private _platform: Optional<PLATFORM>
  private _config: Optional<ConfigOptions['config']>

  constructor(options?: ConfigOptions) {
    if (options) {
      if (options.platform) this._platform = options.platform
      this._config = options.config
    }
  }

  public async loadENV() {
    process.env = Object.assign(process.env, await this.fetchENV())
  }

  public async fetchENV(): Promise<Object> {
    this.validateConfig()
    return this.privateParseConfig(await fetchRawFile(this._platform!, this._config!))
  }

  private setter(key: string, set?: string, required?: boolean): string {
    if (set === undefined) {
      set = process.env[key]
    }
    if (set === undefined) {
      if (required) {
        throw Error(`The ${key.replace(ENVPrefix, '')} was not provided. Please make sure to provide the ${key.replace(ENVPrefix, '')}.`)
      } else {
        set = standard[this._platform!][key]
      }
    }
    return set ?? ''
  }

  private loadConfigFromEnv() {
    if (this._platform === undefined) {
      const env_platform = process.env[env_platform_key]?.toUpperCase()
      if (env_platform !== undefined && Object.keys(PLATFORM).includes(env_platform)) {
        this._platform = env_platform as PLATFORM
      }

      if (this._platform === undefined) {
        throw Error('The platform was not provided. Please make sure to provide the platform.')
      }
    }

    if (this._config === undefined) {
      //@ts-ignore
      this._config = { access_token: undefined, repo: undefined }
    }

    this._config!.access_token = this.setter(env_access_token_key, this._config?.access_token, true)
    this._config!.repo = this.setter(env_repo_key, this._config?.repo, true)
    this._config!.branch = this.setter(env_branch_key, this._config?.branch, false)
    this._config!.file_path = this.setter(env_file_path_key, this._config?.file_path, false)

    switch (this._platform) {
      case PLATFORM.GITHUB:
        ;(this._config as GithubConfig)!.owner = this.setter(env_owner_key, (this._config as GithubConfig)?.owner, true)
        break
      case PLATFORM.GITLAB:
        ;(this._config as GitlabConfig)!.host_url = this.setter(env_host_url_key, (this._config as GitlabConfig)?.host_url, false)
        break
      case PLATFORM.BITBUCKET:
        ;(this._config as BitbucketConfig)!.workspace = this.setter(env_workspace_key, (this._config as BitbucketConfig)?.workspace, true)
        break
    }
  }

  private validateConfig() {
    this.loadConfigFromEnv()

    if (!this._config) {
      throw Error('Error: Configuration data not provided. Please make sure to provide the necessary configuration details.')
    }
  }

  // ~ Parsing

  /**
   * Strips out comments from env file string
   */
  private stripComments(envString: string): string {
    const commentsRegex = /(^#.*$)/gim
    let match = commentsRegex.exec(envString)
    let newString = envString
    while (match != null) {
      newString = newString.replace(match[1], '')
      match = commentsRegex.exec(envString)
    }
    return newString
  }

  /**
   * Strips out newlines from env file string
   */
  private stripEmptyLines(envString: string): string {
    const emptyLinesRegex = /(^\n)/gim
    return envString.replace(emptyLinesRegex, '')
  }

  /**
   * Parse out all env vars from an env file string
   */
  private parseEnvVars(envString: string): { [key: string]: string } {
    const envParseRegex = /^((.+?)[=](.*))$/gim
    const matches: { [key: string]: string } = {}
    let match
    while ((match = envParseRegex.exec(envString)) !== null) {
      // Note: match[1] is the full env=var line
      const key = match[2].trim()
      const value = match[3].trim()

      // remove any surrounding quotes
      matches[key] = value.replace(/(^['"]|['"]$)/g, '').replace(/\\n/g, '\n')
    }
    return matches
  }

  /**
   * Parse out all env vars from a given env file string and return an object
   */
  private parseEnvString(envFileString: string): {
    [key: string]: string
  } {
    // First thing we do is stripe out all comments
    envFileString = this.stripComments(envFileString.toString())

    // Next we stripe out all the empty lines
    envFileString = this.stripEmptyLines(envFileString)

    // Merge the file env vars with the current process env vars (the file vars overwrite process vars)
    return this.parseEnvVars(envFileString)
  }

  privateParseConfig(configFileString: string) {
    const file_ext = (this._config?.file_path?.split('.').pop() ?? '').toLowerCase()

    switch ((this._config?.file_path?.split('.').pop() ?? '').toLowerCase()) {
      case 'json':
        return JSON.stringify(configFileString)
      case 'yml':
        return YAML.parse(configFileString)
      default:
        return this.parseEnvString(configFileString)
    }
  }
}
