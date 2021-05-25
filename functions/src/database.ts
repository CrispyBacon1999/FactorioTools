import admin from "firebase-admin";

// process.env.GCLOUD_PROJECT = "factoriotools";
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://factoriotools-default-rtdb.firebaseio.com/",
});

export const db = admin.database();

export async function getItem(ref: string): Promise<any> {
  return new Promise((resolve, reject) => {
    db.ref(ref).once("value", function (snapshot) {
      resolve(snapshot.val());
    });
  });
}

getItem("test").then((res) => {
  console.log(res);
});
