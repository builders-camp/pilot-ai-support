# TicketPilot: Week 4 starter

Starter project for the **Week 4 challenge** of the Product MBA ("Building with AI").

TicketPilot is a customer success tool for support teams. This starter is a UI-only prototype: an inbox of support tickets, a ticket detail view with a reply box, and dashboard stats. It uses mock data. There is no backend, no AI and no login.

It is the example Week 3 result. If you built your own Week 3 prototype, use yours. If you didn't finish Week 3, start here.

Live preview: https://pilot-ai-support.lovable.app

## Your challenge

Extend the prototype with **backend logic and at least one real integration**, so the product works and isn't just a mockup.

Ideas for the integration, pick at least one:
- An LLM that classifies each ticket by urgency and explains why
- An LLM that drafts a reply for the agent to edit
- Authentication so agents sign in
- Storing tickets and replies in a database (for example Supabase)
- Payments, or an external API such as Slack or email

Use Claude Code inside your IDE to build it. You don't need to write the code by hand.

## Run it locally

1. Clone the repo:
   `git clone https://github.com/builders-camp/pilot-ai-support.git`
2. Go into the folder: `cd pilot-ai-support`
3. Install dependencies: `npm install`
4. Start the dev server: `npm run dev`
5. Open the local URL printed in the terminal.

## Starting from your own Lovable project instead

1. In your Lovable project, open the project settings and find the **Git** or GitHub connection.
2. Connect it to your own GitHub account and create the repo.
3. Clone that repo to your machine and follow the steps above from step 3.

## Working with Claude Code

1. Open the project folder in your IDE.
2. Start Claude Code and describe the feature, for example: "Add an LLM call that classifies each ticket by urgency and shows a badge in the inbox."
3. Keep API keys in a `.env` file. Never commit it. Check that `.env` is listed in `.gitignore`.
4. Run the app and test the feature yourself before you record anything.

## What to submit

Submit these on the Week 4 challenge page:
- Your project's deployed URL (or the repo URL if you haven't deployed)
- A 2-minute Loom video showing the app working, including the real integration

## Built with

[Lovable](https://lovable.dev), TypeScript, React, Vite.
