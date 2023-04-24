const mongoose = require("mongoose");
require("dotenv").config();
mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGODB_CONNECTION_STRING;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
  console.log("I connected");
}

exports.mongoose = mongoose;
