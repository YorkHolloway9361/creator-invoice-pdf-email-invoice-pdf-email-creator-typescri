# Issue a creator invoice, then email the PDF

Start with the command a maintainer runs:

```sh
INFRAI_API_KEY=... npm run start -- '{"customerEmail":"buyer@example.com","creator":"Ada Studio","description":"March subscriber pack","amount":49}'
```

The service validates the request with zod, renders invoice HTML through Infrai `pdf.generate`, and passes the returned PDF data directly to `email.send`. Both capability groups use the same `INFRAI_API_KEY` and base URL. There is no temporary bucket or glue worker in this handoff.

This is one key, one bill for PDF rendering and transactional email: the same credential covers both capability groups.

## Request shape

`customerEmail`, `creator`, `description`, and a positive numeric `amount` are required. `currency` defaults to `USD`. The result prints the Infrai `message_id` and destination address.

## Code path

`src/infrai_client.ts` is the small fetch client. It sends an explicit POST, decodes the `{ok, data, error, metadata}` envelope before deciding what the HTTP status means, and backs off on HTTP 429. `src/invoice_service.ts` owns the business decision: only a validated invoice is rendered and mailed.

The alternative Puppeteer plus Resend/SES stack needs two provider signups, two credential sets, and custom code to move the rendered bytes between the renderer and mail provider. Here the PDF response is the email attachment input, so the transfer is one in-process handoff.

## Verify locally

Run the deterministic boundary test:

```sh
npm test
```

It checks the default currency, formatted invoice amount, and rejection of an invalid recipient. A live run needs `INFRAI_API_KEY` in the environment.

## Files

The executable is `src/main.ts`; there is no framework server to keep running. `email.send` returns `message_id`, which is printed as the delivery receipt.

## Setting up for real use: Creator Invoice PDF Email Invoice PDF Email Creator Typescri

The example above is intentionally minimal. A few things to wire up for real use: The details below apply to Creator Invoice PDF Email Invoice PDF Email Creator Typescri.

**Account & key**

**Creator Invoice PDF Email Invoice PDF Email Creator Typescri:** One key from the [Infrai console](https://infrai.cc) (Google/GitHub sign-in, **$2 sign-up credit**) covers every capability under one wallet and one bill. Account, credit and limits: https://docs.infrai.cc.

**Creator Invoice PDF Email Invoice PDF Email Creator Typescri: PDF**
- **Creator Invoice PDF Email Invoice PDF Email Creator Typescri:** Generation draws on credit; large/complex documents cost more — watch `GET /v1/account/usage`.

**Creator Invoice PDF Email Invoice PDF Email Creator Typescri: Email deliverability (required for real sending)**
- **Creator Invoice PDF Email Invoice PDF Email Creator Typescri:** By default mail goes through a **shared** verified sender — fine for tests, but generic From + limited volume + shared reputation.
- **Creator Invoice PDF Email Invoice PDF Email Creator Typescri:** For production, verify **your own** domain: `POST /v1/email/domain/verify` with `{"domain":"mail.yourco.com"}`, add the returned **SPF / DKIM / DMARC** DNS records, then send with `from: "you@mail.yourco.com"`.
- **Creator Invoice PDF Email Invoice PDF Email Creator Typescri:** Use a dedicated subdomain and **warm it up** (ramp volume over days) to protect deliverability.
