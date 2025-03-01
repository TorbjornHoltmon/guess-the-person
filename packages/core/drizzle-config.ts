import 'dotenv/config'

import { defineConfig } from 'drizzle-kit'

const cloudflareDatabaseId = process.env.CLOUDFLARE_DATABASE_ID
const cloudflareAccountId = process.env.CLOUDFLARE_ACCOUNT_ID
const cloudflareD1Token = process.env.CLOUDFLARE_D1_TOKEN

if (!cloudflareDatabaseId || !cloudflareAccountId || !cloudflareD1Token) {
  throw new Error('Missing Cloudflare D1 credentials')
}

export default defineConfig({
  schema: './src/schema/**/*.ts',
  out: './migrations',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: cloudflareAccountId,
    databaseId: cloudflareDatabaseId,
    token: cloudflareD1Token,
  },
})
