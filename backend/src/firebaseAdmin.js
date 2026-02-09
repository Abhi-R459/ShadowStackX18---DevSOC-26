import admin from "firebase-admin";
import fs from "fs";

const serviceAccount = JSON.parse(
  fs.readFileSync("./serviceAccountKey.json", "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://devsoc-26-default-rtdb.asia-southeast1.firebasedatabase.app/",
});

export const rtdb = admin.database();
export const storage = admin.storage();
export { admin };
