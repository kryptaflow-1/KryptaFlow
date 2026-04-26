# KryptaFlow Social Bot (starter)

This is a small starter scaffold for scheduled social posts.

## What it does

- Loads a content queue from `content/queue.json`
- Every interval, posts the next item to configured platforms (adapters)

## Setup

1) Copy env file:

```powershell
Copy-Item .env.example .env
```

2) Fill tokens/credentials in `.env`

3) Install & run:

```powershell
npm install
npm run dev
```

## Platforms (adapters)

- X/Twitter: requires API keys and access level.
- Telegram: requires a bot token and chat/channel id.

You can add more adapters in `src/adapters/`.

