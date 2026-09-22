import assert from "node:assert/strict";
import { invoiceRequest, invoiceHtml } from "../src/invoice_service.js";

const parsed = invoiceRequest.parse({ customerEmail: "buyer@example.com", creator: "Studio", description: "Video pack", amount: 12 });
assert.equal(parsed.currency, "USD");
assert.match(invoiceHtml(parsed), /USD 12\.00/);
assert.throws(() => invoiceRequest.parse({ customerEmail: "bad", creator: "Studio", description: "Pack", amount: 12 }));
console.log("invoice boundary checks passed");
