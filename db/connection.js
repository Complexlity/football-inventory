const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
const mongoDB =
  "mongodb+srv://myAtlasDBUser:myatlas-001@myatlasclusteredu.hotpokv.mongodb.net/football-inventory?retryWrites=true&w=majority";

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
  console.log("I connected");
}

exports.mongoose = mongoose;
