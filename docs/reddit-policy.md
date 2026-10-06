# Reddit requirements

Access, registration, and migration guidance checked 2026-10-07; other policy summaries were last reviewed 2026-09-21. Verify the live policies before deploying; this document is not permission from Reddit.

- [Responsible Builder Policy](https://support.reddithelp.com/hc/en-us/articles/42728983564564-Responsible-Builder-Policy): API access requires explicit approval; apps must register and receive an App profile label. Automated activity must stay within its approved purpose and scope. The policy directs developers toward Devvit and provides a request route for unsupported cases. It prohibits spam and identical or substantially similar automated content across communities.
- [Don't break the site](https://support.reddithelp.com/hc/en-us/articles/360043512931-Don-t-break-the-site): do not bypass technical restrictions, scrape without authorization, conceal automated identity or automate unsolicited outreach.
- [Spam](https://support.reddithelp.com/hc/en-us/articles/360043504051-Spam): manual and automated unwanted repeated engagement can violate the policy. Community rules may be stricter. Application pacing is not an exemption.
- [Reddit Rules](https://redditinc.com/policies/reddit-rules): community rules, privacy, authenticity and content restrictions apply to posts and comments made by apps.
- [Disrupting Communities](https://support.reddithelp.com/hc/en-us/articles/360043066412-Disrupting-Communities) and [User Agreement](https://redditinc.com/policies/user-agreement): do not evade enforcement or use another identity to continue prohibited activity.

Technical references:

- [Data API Wiki](https://support.reddithelp.com/hc/en-us/articles/16160319875092-Reddit-Data-API-Wiki)
- [Reddit API endpoint documentation](https://www.reddit.com/dev/api/)
- [Reddit's archived OAuth2 documentation](https://github.com/reddit-archive/reddit/wiki/OAuth2) — protocol reference, not current access approval guidance.
- [Ollama chat API](https://docs.ollama.com/api/chat)

Stop after an account restriction, revoked access, refusal, unknown submission outcome or missing permission. A publicly readable profile does not establish eligibility. Do not rotate accounts, proxies, credentials or interfaces to resume blocked actions. Resolve the underlying issue through Reddit's official process; this software does not submit appeals.

## Data API transition

Reddit's [migration announcement](https://www.reddit.com/r/redditdev/comments/1wubcvf/moving_data_api_apps_to_the_developer_platform/) lists the following planned changes:

- **October 31, 2026:** new requests for public API access will no longer be accepted.
- **January 12, 2027:** access starts to close for apps and users that have not registered or engaged with Reddit's outreach.
- **March 2027:** remaining public API access closes.

These are Reddit's announced dates, not guarantees made by this project. Check the announcement for updates. Reddit's [migration guide](https://developers.reddit.com/docs/guides/migrate/public-api) describes Devvit as the primary path for Reddit extensions and explains the capabilities that may require additional access.

RED AGENT currently uses the Data API; it does not implement Devvit. Its `demo` command uses synthetic data, and `preview` uses the operator's configured topics and model without Reddit access. Those commands remain useful without app registration. Reading Reddit discussions and publishing through the agent still require approved access. A copy of the repository does not inherit another operator's approval.
