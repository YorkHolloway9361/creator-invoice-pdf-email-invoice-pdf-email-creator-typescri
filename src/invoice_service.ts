import { z } from "zod";
import { InfraiClient } from "./infrai_client.js";

export const invoiceRequest = z.object({
  customerEmail: z.string().email(),
  creator: z.string().min(1),
  description: z.string().min(1),
  amount: z.number().positive(),
  currency: z.string().length(3).default("USD")
});
export type InvoiceRequest = z.infer<typeof invoiceRequest>;

export function invoiceHtml(input: InvoiceRequest): string {
  return `<h1>Invoice</h1><p>Creator: ${input.creator}</p><p>${input.description}</p><strong>${input.currency} ${input.amount.toFixed(2)}</strong>`;
}

export async function issueInvoice(client: InfraiClient, input: unknown) {
  const invoice = invoiceRequest.parse(input);
  const pdf = await client.generatePdf(invoiceHtml(invoice));
  const email = await client.sendEmail({
    to: invoice.customerEmail,
    subject: `Invoice from ${invoice.creator}`,
    html: `<p>Your invoice is attached.</p><p>${invoice.description}</p><pre>${pdf.pdf}</pre>`
  });
  return { messageId: email.message_id, deliveredTo: invoice.customerEmail };
}
