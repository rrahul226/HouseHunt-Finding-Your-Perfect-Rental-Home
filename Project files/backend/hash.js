// hash.js
const bcrypt = require("bcryptjs");

const plainPassword = "rahul_273"; // replace with your desired password

bcrypt.hash(plainPassword, 10, (err, hash) => {
  if (err) throw err;
  console.log("Hashed password:", hash);
});
