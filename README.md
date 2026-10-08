# RED AGENT

**English** · [Русский](README.ru.md)

A local Reddit writing agent built with Node.js. It generates posts and comments with Ollama, keeps a draft queue, and can publish through Reddit's API using OAuth.

## Use with Codex or another coding assistant

**Give this repository link to Codex or another coding assistant and ask it to set up and run RED AGENT for you.** With the necessary tools, access, and permissions, the assistant can inspect the project, prepare the local environment, configure the model and writing preferences, run checks, connect your approved Reddit app, and operate the agent within the scope you authorize. You do not have to work through every terminal command yourself.

Copy this request into your assistant:

> Set up and run RED AGENT for me: https://github.com/dorsem/red-agent. Read README.md and AGENTS.md, inspect my environment, and carry out the setup. Configure the model, topics, and writing style with me, run the offline demo, and generate a first draft. If I have approved Reddit access, help me complete OAuth and check the chosen communities before using the connected workflow. Publish or start a limited automatic run only when I have authorized its destinations, actions, and limits. Continue through the steps already covered by my permissions; ask for missing choices, access, or required confirmations. Verify the result and tell me what is running and what still needs my input.

What you provide:

- **Tools and local access:** an assistant that can read the repository, work with files, and run terminal commands. Browser access can help with the sign-in flow when the assistant's environment supports it.
- **Your choices and permissions:** the model, writing goals, destination communities, and any installation or publishing permissions. You complete sign-in and any confirmations that require your participation.
- **For Reddit-connected operation:** your own approved app and API access, an eligible account, and permission for automation in the selected communities. Local generation with Ollama works without Reddit access.

[AGENTS.md](AGENTS.md) tells the assistant how to carry the task through setup, validation, and authorized operation. If a required capability or permission is missing, it should finish the available steps and explain the remaining blocker. This is a supported setup workflow, not a guarantee that every assistant environment can complete every step.

Codex can operate the desktop app's built-in browser; Codex CLI and the IDE extension do not include that browser ([OpenAI documentation](https://learn.chatgpt.com/docs/browser)). Browser tools come from your assistant's environment. RED AGENT's implemented Reddit connection uses OAuth and the Data API; it has no browser publishing backend. Current access requirements are explained [below](#can-anyone-connect-their-own-reddit-account).

If you only want a text drafted in the assistant's conversation, say so. That uses the assistant's own model and does not configure or launch RED AGENT's Ollama backend.

Runs on **Node.js 22+ with no external npm dependencies**. You choose the model, editorial profile, publication targets, and limits in a local configuration file. Reddit-connected features require your own approved Reddit app and API access for your use case.

The default is to prepare drafts. Publishing requires an explicit command, and automated runs have a fixed number of cycles. Before sending, the agent checks the account, community rules, limits, and duplicates. If a submission's outcome is unknown, it stops until the result is reconciled.

**Status: prototype.** Automated tests use simulated service responses. A live OAuth, model, and publishing flow still needs to be verified with an approved app.

## Features

The default editorial profile is `commons`; you can change it in the configuration. The model proposes a post, comment, or skip. The application validates the proposal and handles publishing.

| Feature | Current behavior |
| --- | --- |
| Comments | Checks the latest 10 posts in a configured community, selects the first eligible post less than 24 hours old, reads up to five comments, and proposes one reply to the post. The model may decline. |
| Original posts | Writes about the next topic in your list for an allowed community or your own profile. |
| Draft queue | Stores text locally for review, publication, or rejection. |
| Automatic publishing | Prepares and attempts to send at most one item per cycle. You set the cycle count when starting a run. |
| Conversation follow-ups | Finds direct replies to the agent's recent publications and drafts a reply to a selected comment using its thread context. |
| Community discovery | Searches community names and descriptions through the Reddit API. Returns candidates without adding them to your configuration. |
| Manuscript import | Imports UTF-8 `.md` and `.txt` files without model processing. Preserves the text; adds a disclosure only when configured. |
| Images | Accepts local PNG/JPEG files up to 10 MiB. Uploads the image when you explicitly publish the draft. |
| Source search | Searches Wikipedia or a configured SearXNG instance, stores results, and supplies selected sources to the model through `--sources`. |
| Multiple accounts | Runs 1–8 agents in separate processes, each with its own configuration, OAuth credentials, queue, and limits. |

See the [workflow examples](docs/workflows.md) and [multiple-account guide](docs/fleet.md), currently in Russian. Reply, manuscript, and image preparation commands create drafts; use `publish ID` to send them. Source search returns links and search excerpts. It does not read full pages or automatically verify facts.

## Try it without an account

Install [Node.js 22+](https://nodejs.org/). Download the project with **Code → Download ZIP**, extract it, and open a terminal in the project directory:

```sh
npm run demo
```

This shows a draft for a fictional discussion using a fixed example response. It demonstrates the queue without running a model or contacting Reddit. You do not need to install npm dependencies.

## Generate with your own model

Install [Ollama](https://ollama.com/) and download a model that can return JSON. Start Ollama, then create your local configuration:

```sh
node bin/cli.js init
```

In `agent.config.json`, set `ollama.model` to the exact name of your installed model. Edit `mission`, `voice`, `language`, and `topics` to fit what you want to write. Then run:

```sh
node bin/cli.js preview
```

`preview` generates a sample post about `topics[0]` and prints the result in the terminal. It calls your configured model server, without connecting to Reddit, creating a queued draft, or publishing anything. You can edit the result and manually post it where permitted.

This is the available writing workflow without Reddit app registration. It does not read Reddit threads or automatically reply to them.

## Can anyone connect their own Reddit account?

The code supports each operator's own approved app and OAuth login. It does not include shared credentials or access through the project author's account. Downloading the code or changing the `permissions` flags does not grant Reddit access.

Reddit requires app registration and explicit approval for API access. If registration or access has been refused, use the local `demo` and `preview` commands. The project cannot promise “download, enter your login, and start posting.” See the [Responsible Builder Policy](https://support.reddithelp.com/hc/en-us/articles/42728983564564-Responsible-Builder-Policy).

**API transition:** Reddit has announced a move from the public Data API to Devvit. This project currently uses the Data API and has no Devvit implementation. See the [transition dates and official references](docs/reddit-policy.md#data-api-transition) before planning a connected deployment.

## Connect an approved app

In addition to Node.js and Ollama, you need an approved Reddit app with API access for your use case and permission for automation in your chosen communities.

1. Run `node bin/cli.js init` if you have not already. It creates `agent.config.json` and `.env` without overwriting existing files. Both are excluded from Git.
2. Configure your approved app's OAuth redirect URI as `http://127.0.0.1:8765/callback`. The code supports the authorization-code flow for an installed app or a confidential web app with that callback.
3. Set `REDDIT_CLIENT_ID` and a descriptive `REDDIT_USER_AGENT` in `.env`. Set `REDDIT_CLIENT_SECRET` only for a confidential app. Never enter a Reddit password in these files.
4. Configure your model and topics. Set `permissions.apiApproved`, `permissions.appRegistered`, and `permissions.accountEligible` to `true` only when each is actually satisfied. These fields record your confirmation; they do not verify Reddit's decision.
5. Add permitted communities to `communities`, for example `{ "name": "YOUR_COMMUNITY", "automationAllowed": true }`, using the community name without `r/`. Original posts require `actions.posts: true`. For your own profile, also enable `profilePosts: true`; the agent obtains the profile name from OAuth.

Run all commands from the same agent directory:

```sh
node bin/cli.js auth
node bin/cli.js doctor
node bin/cli.js rules YOUR_COMMUNITY
node bin/cli.js rules YOUR_COMMUNITY --accept
```

`auth` prints a URL to open yourself. Check the account and permissions on Reddit before authorizing. The agent requests `identity`, `read`, and `submit`, listens on `127.0.0.1` for up to five minutes, and stores tokens locally. Your password is entered only on Reddit.

Replace `YOUR_COMMUNITY` with your permitted community, or `@profile` for your own profile. Read the rules before using `--accept`: it records your review and confirmation that automation is allowed. An unavailable rules response stops the agent.

The [detailed setup guide](docs/setup.md) is currently in Russian.

## Adjust the writing style

```sh
node bin/cli.js settings
```

The terminal presents `[x]` switches for editing repetitive or formulaic language, humor, voice features, and review of every text before sending. Enter a number to toggle an option, then `s` to save. See the [voice guide](docs/voice.md), currently in Russian.

Editing does not conceal automation or guarantee acceptance by moderators. The agent checks current rules and limits, avoids duplicates, and stops on access problems. If the model flags a publication risk, the text stays for review. The model can miss violations; these checks cannot guarantee that an account will avoid restrictions.

The optional `disclosure` footer defaults to an empty string. Leave it empty or omit it to add no footer; set it when the destination requires disclosure. Existing configurations keep their explicit value: set `"disclosure": ""` to disable it. Community rules still apply. Comments have no target word count; one sentence is enough when it answers the point.

## Run after setup

Prepare one draft:

```sh
node bin/cli.js run
```

If there is an eligible topic and the model produces text, the command displays the draft and its `id`. Review the queue and the chosen draft before sending:

```sh
node bin/cli.js status
node bin/cli.js show DRAFT_ID
node bin/cli.js publish DRAFT_ID
```

Replace `DRAFT_ID` with the returned `id`. To generate and publish automatically for a limited run:

```sh
node bin/cli.js run --publish --cycles 3
```

This runs at most three cycles, each with at most one submission attempt. By default, writes are at least one hour apart, with at most three attempts in a rolling 24-hour period. Skipped topics do not count as publications. Errors or failed checks can stop the run early. The computer and process must remain running.

Text the model flags as involving personal suffering or an immediate crisis remains a draft even with `--publish`, so you can review it first. This is a model assessment and may miss such cases.

Without `--publish`, generated text stays in the draft queue. Runs support 1–20 cycles; there is no infinite mode. Intervals and limits are configurable but do not guarantee continued Reddit access.

## Stop publishing

```sh
node bin/cli.js halt
```

This blocks subsequent sends; it cannot recall a request already sent. If Reddit has not confirmed a submission's outcome, the agent stops instead of retrying blindly. See the [recovery guide](docs/recovery.md), currently in Russian, for reconciliation and resuming.

## Data and privacy

Configuration, tokens, and queued drafts stay in local files excluded from Git. Ollama processes text on your computer by default. An explicitly configured remote model server receives the context supplied to it. Tokens are not sent to the model. See the [storage details](docs/recovery.md#данные-и-ограничения), currently in Russian.

## Validation

Automated tests cover the queue and submission failures, reply context, manuscript import, media uploads, source selection, and account isolation during parallel runs. CI runs on Linux, macOS, and Windows with Node.js 22 and 24. These tests do not establish that Reddit will approve an app or that a model will produce a good reply.

```sh
npm test
```

The remaining live validation is to complete OAuth with an approved app, generate a draft with a real model, and verify one permitted publication. Until then, the project remains a prototype.

Further documentation, currently in Russian: [Product review](docs/product-review.md) · [Setup](docs/setup.md) · [Recovery](docs/recovery.md) · [Architecture](docs/architecture.md).

In English: [Reddit requirements](docs/reddit-policy.md) · [Security](SECURITY.md).

## License

[MIT](LICENSE).
