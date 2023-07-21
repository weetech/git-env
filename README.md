# git-env

## Description
The project is a library designed to facilitate the retrieval and parsing of environment variables from various hosting platforms. It provides functions to extract environment variables from environment files stored on GitLab, GitHub, and Bitbucket.

Overall, this library simplifies the process of retrieving and parsing environment variables from environment files stored on different hosting platforms, making it easier to manage and utilize those variables within an application.

## Installation

Either through cloning with git or by using [npm](http://npmjs.org) (the recommended way):

```bash
npm install git-env # or yarn install git-env
```

### Parameters

- `hostingPlatform` (string): The hosting platform where the repository is hosted. It accepts three possible values: `"gitlab"`, `"github"`, or `"bitbucket"`. This parameter determines the platform-specific logic for retrieving the environment file.

- `config` (object): Additional configuration options for the hosting platform. This parameter is optional and can be used to provide specific configuration settings based on the hosting platform.
<!-- 
For platform-specific parameters, refer to the following:

- If the `hostingPlatform` is `"bitbucket"`, the `config` object can include properties like `workspace` (string) to specify the GitLab workspace or organization associated with the repository.

- If the `hostingPlatform` is `"github"`, the `config` object can include properties like `owner` (string) to specify the GitHub owner or organization associated with the repository.

- If the `hostingPlatform` is `"gitlab"`, the `config` object can include properties like `host_url` (string) to specify the GitHub owner or organization associated with the repository. -->

## Usage
To represent both ways of providing configuration in the usage section, you can update the code examples as follows:

## 1. Using a Environment Variable
The library supports configuration using various file formats such as `.env`, `.json`, or `.yaml`. By providing a configuration file in one of these formats.

To utilize the `git-env` library, you can create a `.env` file in your repository. The `.env` file should contain the environment variables you want to retrieve and use in your application.

Here's an example of a `.env` file:

```javascript

GIT_ENV_PLATFORM=gitlab
GIT_ENV_ACCESS_TOKEN=your-access-token
GIT_ENV_REPO=your-repository /* project-id for gitlab, repo-slug for bitbucket */ 
GIT_ENV_BRANCH=your-repo-branch
GIT_ENV_FILE_PATH=.env

GIT_ENV_OWNER=your-github-username  # Only for GitHub
GIT_ENV_HOST_URL=your-gitlab-host-url  # Only for GitLab
GIT_ENV_WORKSPACE=your-bitbucket-workspace  # Only for Bitbucket
```

**Note**: Assign the appropriate values to each environment variable without changing the key names. This configuration enables the library to fetch and load the environment variables from the corresponding hosting platform based on the provided values.

Once you have the `.env` file in your repository, you can use the `loadEnvFromFile` function to load the environment variables directly from the file:

```javascript
/* Import the required function from the library */
import GitENV, { PLATFORM } from "git-env";

async function main() {
    const readENV = new GitENV();
    /* This function is used to fetch environment variables from a repository 
    hosted on different platforms and load them into the process.env. */
    await readENV.loadEnv();

   /* This function is used to fetch environment variables from a repository hosted 
   on different platforms and returns them as an object but without directly 
   modifying the process.env. */
  // await readENV.fetchEnv();
}

main();
```
Users can choose the approach that suits their needs and provide the necessary configuration accordingly.

## 2. Using Function Arguments 
The library provides two functions, `loadEnv` and `fetchEnv`, that allow you to retrieve and load environment variables using function arguments.

Here an example demonstrates how to directly specify the configuration using function arguments, allowing users to provide the necessary details. 

```javascript
/* Import the required functions and constants from the library */
import GitENV, { PLATFORM } from "git-env";


const platform = PLATFORM.GITHUB;
const config = { 
    access_token: "your-access-token",
    repository: "your-repository", /* project-id for gitlab, repo-slug for bitbucket */ 
    repo_branch: "your-repo-branch",
    file_path: ".env",
    /* Additional platform-specific configuration options */
    host_url: "your-gitlab-host-url", # Only for GitHub
    owner: "your-github-username", # Only for GitLab
    workspace: "your-bitbucket-workspace", # Only for Bitbucket
}


async function main() {
    const readENV = new GitENV({platform, config});
    /* This function is used to fetch environment variables from a repository 
    hosted on different platforms and load them into the process.env. */
    await readENV.loadEnv();

  /* This function is used to fetch environment variables from a repository hosted 
  on different platforms and returns them as an object but without directly 
  modifying the process.env. */
  // await readENV.fetchEnv();
}

main();
```

## Obtaining Repository Access Token Platform Wise

### GitLab

To obtain the GitLab repository access token and information, follow these steps:

- [access_token](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html#:~:text=On%20the%20left%20sidebar%2C%20select,later%20than%20the%20current%20date.)
<!-- - [host_url](https://docs.gitlab.com/ee/api/repository_files.html#get-raw-file-from-repository)
- [file_path](https://docs.gitlab.com/ee/api/repository_files.html#get-raw-file-from-repository)
- [repo_branch](https://docs.gitlab.com/ee/api/repository_files.html#get-raw-file-from-repository) -->


### GitHub

To obtain the GitHub repository access token and information, follow these steps:

- [access_token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)
<!-- - [owner](https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#get-a-repository)
- [repo](https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#get-a-repository)
- [file_path](https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#get-repository-content--parameters)
- [repo_branch](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-branches-in-your-repository/viewing-branches-in-your-repository) -->


### Bitbucket

To obtain the Bitbucket repository access token and information, follow these steps:

- [access_token](https://support.atlassian.com/bitbucket-cloud/docs/create-a-repository-access-token/)
<!-- - [workspace](https://support.atlassian.com/bitbucket-cloud/docs/what-is-a-workspace/)
- [repo_slug](https://support.atlassian.com/bitbucket-cloud/docs/what-is-a-workspace/)
- [repo_branch](https://support.atlassian.com/bitbucket-cloud/docs/list-branches-in-a-repository/)
- [file_path](https://support.atlassian.com/bitbucket-cloud/docs/hyperlink-to-source-code-in-bitbucket/#How-to-obtain-the-owner--repository-name--and-commit) -->
