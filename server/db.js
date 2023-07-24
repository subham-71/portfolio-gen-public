const { getFirestore, Timestamp, FieldValue} = require('firebase-admin/firestore');
const {getStorage} = require('firebase-admin/storage');


var admin = require("firebase-admin");
var serviceAccount = require("./firebase-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = {db};