# TicketPilot AI Assist

Build a UI prototype called "TicketPilot", an AI-powered customer success tool for support teams.

Who it's for: Marta, Head of Customer Success at a mid-size SaaS company. Her team of 6 agents is drowning in 200+ tickets a day. The urgent ones (billing errors, outages, angry customers) get buried under routine questions, and she wants an AI tool that triages and prioritizes automatically.

Screens:

Inbox. A list of 10 realistic fake tickets. Each shows customer name, company, subject, a two-line message preview, time received, and an urgency badge. Include a filter bar (All / High / Medium / Low) and a search field.

Ticket detail. Opens when you click a ticket. It shows the full customer message, customer info, an "AI analysis" panel, and a reply box with a "Send" button.

Dashboard header. Three stat cards above the inbox: open tickets, high-urgency tickets, and average resolution time.

AI feature: Each ticket gets an urgency tag (High / Medium / Low) and a one-line reason, such as "Customer reports being charged twice." Show the tag as a colored badge (red / amber / green) in the inbox and the reason in the AI analysis panel. Add an "Auto-tag all" button that applies the tags with a short loading animation. Fake the AI with hardcoded logic and mock data. No backend, no login.

Design: Clean, modern SaaS look. Left sidebar (Inbox, Analytics, Settings, decorative only), white background, one blue accent color, rounded cards, readable typography. It must work well on desktop.

Tickets to include: a double-charge complaint (High), a full outage report (High), a password reset (Low), a feature request (Low), a slow-loading dashboard (Medium), a refund request (Medium), and four more of varied urgency.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://pilot-ai-support.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4f9e8c13-75f1-4a2b-a4f1-a021220b9196).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
