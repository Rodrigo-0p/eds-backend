var CryptoJS = require("crypto-js");
require("dotenv").config();

var secretKey = process.env.CRIPTO;
exports.encrypt = async(plainText) =>{
    return CryptoJS.AES.encrypt(plainText, secretKey).toString();
}
exports.decrypt = async(cipherText) =>{
    var bytes  = CryptoJS.AES.decrypt(cipherText, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
}