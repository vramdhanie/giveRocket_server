require("dotenv").config();
const express = require("express");
const Firestore = require("@google-cloud/firestore");

const app = express();
const jsonParser = express.json();

const db = new Firestore({
  projectId: process.env.FIRESTORE_PROJECT_ID,
  credentials: {
    private_key: process.env.FIRESTORE_PRIVATE_KEY,
    client_email: process.env.FIRESTORE_CLIENT_EMAIL
  }
});

//test the listener here
let query = db.collection("bids");
let unsubscribe = query.onSnapshot(qSnap => {
  let changes = qSnap.docChanges();
  for (let change of changes) {
    console.log(`A document was ${change.type}`);
    console.log(change.doc.data());
  }
});

app.get("/", async (req, res) => {
  try {
    let query = db.collection("bids");
    let snapshot = await query.get();
    const results = [];
    snapshot.forEach(docSnap => results.push(docSnap.data()));
    res.json(results);
  } catch (err) {
    res.status(500).send(`Something went terribly wrong! - ${err}`);
  }
});

app.post("/", jsonParser, async (req, res) => {
  let bids = db.collection("bids");
  try {
    let bidRef = await bids.add(req.body);
    let newBid = await bidRef.get();
    res.status(201).json(newBid.data());
  } catch (err) {
    res.status(500).send(`Something is really wrong here: ${err}`);
  }
});

app.listen(9000, () => {
  console.log("Server listening on port 9000");
});
