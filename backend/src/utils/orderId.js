import crypto from "crypto";

const orderId = `ORD-${crypto.randomBytes(6).toString("hex").toUpperCase()}`;

export default orderId;