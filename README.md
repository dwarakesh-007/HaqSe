# HaqSe

**Your rights, in simple words.**

Not everyone can afford a lawyer. HaqSe helps ordinary people in India understand their legal rights and take the next step: in plain language, in their own language, for free.

Tell HaqSe your problem in your own words (type or speak). It:

1. Asks a few simple questions to understand what happened
2. Explains your rights in plain words
3. Tells you exactly what to do next
4. Writes the letter or complaint for you, ready to download as a PDF
5. Points you to free legal aid when a case is too serious for an app

## What it covers (Version 1)

| Area | Example |
|---|---|
| 🛒 Consumer problems | "I got a broken phone online and they won't refund me" |
| 📱 Cyber fraud | "Someone took money from my UPI after a fake call" |
| 📄 Right to Information (RTI) | "I want to know why my scholarship hasn't come" |

States: Telangana and Andhra Pradesh to start. Languages: English, Telugu, Hindi.

## How it stays accurate

The AI does **not** answer from its own memory. Every answer comes from legal content we write and check ourselves, stored as plain files in [`legal-content/`](legal-content):

- `legal-content/central/`: national laws, one file per area
- `legal-content/states/`: state-specific details (fees, offices, helplines), one file per state

Adding a new area or state means adding a file, not rewriting the app.

> ⚠️ HaqSe gives general legal information, not legal advice. All legal content is marked `draft` until reviewed.

## Run it locally

```bash
git clone https://github.com/dwarakesh-007/HaqSe.git
cd HaqSe
npm install
cp .env.example .env.local   # then add your Gemini API key
npm run dev
```

Open http://localhost:3000.

Get a free Gemini API key at https://aistudio.google.com/apikey.

## Project structure

```
app/              screens (home, chat) and the /api/ask route
components/       reusable pieces (voice input)
lib/              AI calls, prompt rules, legal content loader, PDF maker
legal-content/    the checked legal rules (central + per state)
templates/        letter and complaint templates
docs/             roadmap
```

## Tech

Next.js · TypeScript · Google Gemini API · jsPDF · browser speech recognition · Vercel

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Legal content contributions are just as valuable as code.

## License

MIT, see [LICENSE](LICENSE).
