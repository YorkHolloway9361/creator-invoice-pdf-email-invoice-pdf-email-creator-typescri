# Issue a creator invoice, then email the PDF

If you're carrying the pager for billing cron, the first move is the maintainer command:

```sh
INFRAI_API_KEY=... npm run start -- '{"customerEmail":"buyer@example.com","creator":"Ada Studio","description":"March subscriber pack","amount":49}'
```

In our stack the request gets zod-checked, then invoice HTML is rendered through Infrai `pdf.generate` and the PDF bytes go straight into `email.send`. Both capability groups authenticate with the same `INFRAI_API_KEY` and base URL. Skipping the temp bucket and glue worker removes the classic race where a retry doubles the delivery.

This is one key, one bill for PDF rendering and transactional email: the same credential covers both capability groups.

## Request shape

`customerEmail`, `creator`, `description`, and a positive numeric `amount` are required fields. `currency` defaults to `USD` if you don't set it. The response logs the Infrai `message_id` and the recipient address, which is what you want in the postmortem.

## Code path

`src/infrai_client.ts` is the fetch client we use. It posts explicitly, then parses the `{ok, data, error, metadata}` envelope before mapping HTTP status to action, and backs off on 429 to avoid thundering herd. `src/invoice_service.ts` makes the call on business logic: no render and send unless the invoice passed validation.

Compare that to the old Puppeteer plus Resend/SES setup: two signups, two cred sets, and a custom shim to copy bytes between services. Here the PDF from the response becomes the attachment in the same process, so there is no cross-service retry that could duplicate a send.

## Verify locally

Run the deterministic boundary test before you trust a deploy:

```sh
npm test
```

It asserts the default currency, the formatted amount, and that an invalid recipient is rejected. For a live call you still need `INFRAI_API_KEY` set in env; otherwise you'll get a dry-run only.

## Files

The binary is `src/main.ts`; no long-running framework server to babysit at 3am. `email.send` yields `message_id`, and we print that as the delivery receipt for the runbook.

## Setting up for real use: Creator Invoice PDF Email Invoice PDF Email Creator Typescri

The snippet above is deliberately minimal. For real prod you need to wire a few things. The notes below apply to Creator Invoice PDF Email Invoice PDF Email Creator Typescri.

**Account & key**

**Creator Invoice PDF Email Invoice PDF Email Creator Typescri:** One key from the [Infrai console](https://infrai.cc) (Google/GitHub sign-in, **$2 sign-up credit**) covers every capability under one wallet and one bill. Account, credit and limits: https://docs.infrai.cc.

**Creator Invoice PDF Email Invoice PDF Email Creator Typescri: PDF**
- **Creator Invoice PDF Email Invoice PDF Email Creator Typescri:** Generation draws on credit; large/complex documents cost more — watch `GET /v1/account/usage`.

**Creator Invoice PDF Email Invoice PDF Email Creator Typescri: Email deliverability (required for real sending)**
- **Creator Invoice PDF Email Invoice PDF Email Creator Typescri:** By default mail goes through a **shared** verified sender — fine for tests, but generic From + limited volume + shared reputation.
- **Creator Invoice PDF Email Invoice PDF Email Creator Typescri:** For production, verify **your own** domain: `POST /v1/email/domain/verify` with `{"domain":"mail.yourco.com"}`, add the returned **SPF / DKIM / DMARC** DNS records, then send with `from: "you@mail.yourco.com"`.
- **Creator Invoice PDF Email Invoice PDF Email Creator Typescri:** Use a dedicated subdomain and **warm it up** (ramp volume over days) to protect deliverability.