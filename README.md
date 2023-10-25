# ElectionGPT - Powered by Neum AI

![image](https://github.com/NeumTry/electiongpt-frontend/assets/10717976/5dcc6b0d-ab85-43de-92f0-54534b38f1e3)

[Live Here](https://electiongpt.ai/)

App that allows users to talk to presidential candidates for the US 2024 election. Leverage Neum AI as its backend to collect data from various data sources.

Candidates included:
- Ryan Binkley - Republican
- Doug Burgum - Republican
- Chris Christie - Republican
- Ron DeSantis - Republican
- Larry Elder - Republican
- Nikki Haley - Republican
- Asa Hutchinson - Republican
- Perry Johnson - Republican
- Mike Pence - Republican
- Vivek Ramaswamy - Republican
- Tim Scott - Republican
- Donald Trump - Republican
- Joe Biden - Democratic
- Marianne Williamson - Democratic
- Robert F Kennedy - Independent

Data sources included:
- Wikipedia
- Ballotpedia
- Candidate Websites
- Published government plans
- Tweets
- Interview transcripts

## Enable data pipelines with Neum AI
*Note:* You will need API Keys for [APIFY](https://apify.com/) and [OpenAI](https://openai.com/) to access the data. In addition, you will need a WCS (Weaviate Cloud Service) cluster that can be created for [free](https://weaviate.io/developers/wcs/quickstart).

1. Sign up at [Neum.AI](dashboard.neum.ai)
2. Get your API Key under Dashboard > Settings
3. [Create Pipelines](https://docs.neum.ai/docs/build-with-apis) using this [sample configuration](https://github.com/NeumTry/electiongpt-frontend/blob/master/sample-pipeline-config.json). We will add additional configuration soon.

## Run frontend

1. Sign up at [OpenAI's Developer Platform](https://platform.openai.com/signup).
2. Go to [OpenAI's dashboard](https://platform.openai.com/account/api-keys) and create an API KEY.
3. Set the required OpenAI environment variable as the token value as shown [the example env file](./.env.local.example) but in a new file called `.env.local`
4. `pnpm install` to install the required dependencies.
5. `pnpm dev` to launch the development server.
