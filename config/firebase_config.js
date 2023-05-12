const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "react-auth-bc0a4.appspot.com"
});

const bucket = admin.storage().bucket()
module.exports = {admin, bucket};