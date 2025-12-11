const bcrypt = require("bcryptjs");

const saltRounds = parseInt(process.env.BCRYPT_SALT) || 12;

module.exports = {
  hash: async (password) => {
    if (!password || typeof password !== "string") {
      throw new Error("Password is required and must be a string");
    }
    return await bcrypt.hash(password, saltRounds);
  },

  compare: async (password, hash) => {
    if (!password || !hash) return false;
    return await bcrypt.compare(password, hash);
  }
};
