import CryptoJS from "crypto-js";

export const encrypt = (data, code) =>
  CryptoJS.AES.encrypt(data, code).toString();

export const decrypt = (cipher, code) =>
  CryptoJS.AES.decrypt(cipher, code).toString(CryptoJS.enc.Utf8);
