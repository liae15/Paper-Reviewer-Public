This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## AgentCore connection

This UI connects CopilotKit to the AgentCore AG-UI runtime through the Next.js route at `src/app/api/copilotkit/[[...copilotkit]]/route.ts`.

Current auth mode: IAM/SigV4. There is intentionally no bearer token in this setup because Cognito installation/configuration was not working reliably. Leave `AGENTCORE_BEARER_TOKEN` unset unless the AgentCore runtime is redeployed with OAuth/Cognito auth.

Required local environment values:

```bash
AGENTCORE_RUNTIME_ARN=arn:aws:bedrock-agentcore:...
AWS_REGION=us-east-1
```

`AGENTCORE_ENDPOINT_URL` may remain as a fallback, but when `AGENTCORE_RUNTIME_ARN` is present the route builds the AWS-recommended AG-UI invocation URL using the encoded runtime ARN and `qualifier=DEFAULT`.

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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
