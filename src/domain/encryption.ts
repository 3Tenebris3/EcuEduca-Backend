import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.ENCRYPT_SECRET || 'my_enc_secret';

/**
 * Cifra el texto plano con AES.
 * @param plainText El texto original.
 * @returns El texto cifrado.
 */
export function encryptData(plainText: string): string {
  return CryptoJS.AES.encrypt(plainText, SECRET_KEY).toString();
}

/**
 * Descifra el texto cifrado.
 * @param cipherText El texto cifrado.
 * @returns El texto original.
 */
export function decryptData(cipherText: string): string {
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}
