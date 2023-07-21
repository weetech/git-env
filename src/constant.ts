import PLATFORM from './@types/platform.type'

export const ENVPrefix = 'GIT_ENV_'
export const env_platform_key = ENVPrefix + 'PLATFORM'
export const env_access_token_key = ENVPrefix + 'ACCESS_TOKEN'
export const env_repo_key = ENVPrefix + 'REPO'
export const env_branch_key = ENVPrefix + 'BRANCH'
export const env_file_path_key = ENVPrefix + 'FILE_PATH'
export const env_owner_key = ENVPrefix + 'OWNER'
export const env_host_url_key = ENVPrefix + 'HOST_URL'
export const env_workspace_key = ENVPrefix + 'WORKSPACE'

export const standard: any = {}

standard.BITBUCKET = {}
standard.GITHUB = {}
standard.GITLAB = {}

standard.BITBUCKET[`${env_branch_key}`] = 'master'
standard.GITHUB[`${env_branch_key}`] = undefined
standard.GITLAB[`${env_branch_key}`] = 'main'

standard.BITBUCKET[`${env_file_path_key}`] = '.env'
standard.GITHUB[`${env_file_path_key}`] = '.env'
standard.GITLAB[`${env_file_path_key}`] = '.env'

standard.GITLAB[`${env_host_url_key}`] = 'https://gitlab.com'
