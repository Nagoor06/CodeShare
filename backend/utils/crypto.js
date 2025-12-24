import CryptoJS from "crypto-js";

export const encrypt = (data, code) =>
  CryptoJS.AES.encrypt(data, code).toString();

export const decrypt = (cipher, code) => {
  const bytes = CryptoJS.AES.decrypt(cipher, code);
  return bytes.toString(CryptoJS.enc.Utf8);
};
