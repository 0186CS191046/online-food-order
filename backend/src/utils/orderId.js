import crypto from "crypto";

const orderId = `ORD-${crypto.randomBytes(6).toString("hex").toUpperCase()}`;
export const generateRandomPassword = `${crypto.randomBytes(8).toString("hex")}`

export default orderId;
