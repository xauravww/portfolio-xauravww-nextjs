This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## MongoDB Atlas Keep-Alive (Free Tier)

MongoDB Atlas free tier clusters automatically pause after 60 days of inactivity. To prevent this, set up a cron job to keep the database active.

### Manual Execution

Run the keep-alive script manually:

```bash
npm run keep-mongo-alive
```

### Cron Job Setup

#### Linux/Mac (crontab)

1. Open crontab editor:
   ```bash
   crontab -e
   ```

2. Add this line to ping MongoDB every 30 minutes:
   ```bash
   */30 * * * * cd /path/to/your/portfolio-xauravww-nextjs && npm run keep-mongo-alive >> /var/log/mongo-keepalive.log 2>&1
   ```

   Replace `/path/to/your/portfolio-xauravww-nextjs` with your actual project path.

#### Windows (Task Scheduler)

1. Open Task Scheduler
2. Create a new task
3. Set trigger to run every 30 minutes
4. Set action to run `npm run keep-mongo-alive`
5. Set the working directory to your project folder

#### Using GitHub Actions (Recommended for hosted projects)

Create `.github/workflows/mongo-keepalive.yml`:

```yaml
name: MongoDB Keep Alive
on:
  schedule:
    # Run every 30 minutes
    - cron: '*/30 * * * *'
  workflow_dispatch:

jobs:
  keep-alive:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run keep-mongo-alive
        env:
          MONGODB_URI: ${{ secrets.MONGODB_URI }}
          DB_NAME: ${{ secrets.DB_NAME }}
```

Make sure to add your `MONGODB_URI` and `DB_NAME` as GitHub secrets.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
