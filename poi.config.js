require("dotenv").config();

module.exports = {
  entry: "src/index.js",
  output: {
    dir: "public",
    publicUrl: process.env.DEPLOY_URL,
  },
};
