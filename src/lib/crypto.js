// src/utils/crypto.js
import CryptoJS from "crypto-js";

// Shared secret key (in real apps, generate per user/session securely)
const SECRET_KEY = "mySecretKey123";

export function encryptMessage(message) {
  return CryptoJS.AES.encrypt(message, SECRET_KEY).toString();
}

export function decryptMessage(cipherText) {
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}
