import * as functions from "firebase-functions";
import { parseLuaFileData } from "./factorio/parse";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const parseFile = functions.https.onRequest((request, response) => {
  const modid = request.query.modid;
  const type = request.query.type;
  const fileData = request.body;

  const parsed = parseLuaFileData(fileData);
  response.status(200).send(parsed);
});
