const mongoose = require('mongoose');
const DbName = 'friday'
const PORT = 27017
const Rank = require("./core/db/model/Rank.js")

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(`mongodb://wsh:19930304wsh@localhost:${PORT}/${DbName}`);
  console.log(`db:${DbName} connected on port:${PORT}`)
  for(let i=0; i<10; i++) {
    await Rank.create({rank: i})
  }
  console.log("create OK")
}


