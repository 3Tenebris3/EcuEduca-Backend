import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.ENCRYPT_SECRET || 'SAME_AS_FRONT';

export function encryptData(plainText: string): string {
  return CryptoJS.AES.encrypt(plainText, SECRET_KEY).toString();
}

export function decryptData(cipherText: string): string {
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}