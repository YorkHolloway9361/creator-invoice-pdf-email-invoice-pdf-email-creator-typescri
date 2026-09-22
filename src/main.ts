import { InfraiClient } from "./infrai_client.js";
import { issueInvoice } from "./invoice_service.js";

const key = process.env.INFRAI_API_KEY;
if (!key) throw new Error("INFRAI_API_KEY is required");
const payload = process.argv[2] ? JSON.parse(process.argv[2]) : {
  customerEmail: "customer@example.com", creator: "Ada Studio", description: "March subscriber pack", amount: 49
};
const result = await issueInvoice(new InfraiClient(key), payload);
console.log(JSON.stringify(result));
