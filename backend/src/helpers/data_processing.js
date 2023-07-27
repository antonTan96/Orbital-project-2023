const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

function encrypt_data(data) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', process.env.AES_256_PRIVATE_KEY, iv);
    let encrypted = cipher.update(data, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    encrypted = iv.toString('hex') + encrypted;
    return encrypted;
}

function decrypt_data(data) {
    const iv = Buffer.from(data.slice(0, 32), 'hex');
    data = data.slice(32);
    const decipher = crypto.createDecipheriv('aes-256-cbc', process.env.AES_256_PRIVATE_KEY, iv);
    let decrypted = decipher.update(data, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
}

async function hash_password(password) {
    return await bcrypt.hash(password, bcrypt.genSaltSync(12));
}

function jwt_generate_auth_token(data, duration) {
    return jwt.sign({"Data" : data}, process.env.JWT_PRIVATE_KEY, {
        "expiresIn" : duration
    });
}

module.exports = {encrypt_data, decrypt_data, hash_password, jwt_generate_auth_token};