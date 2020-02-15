const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.json({
    message: "Everything is OK!"
  });
});

app.listen(9000, () => {
  console.log("Server listening on port 9000");
});
