// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require("express");

const app = express();

app.get("/users", (req, res) => {
  res.json([{ id: 1, name: "xz" }]);
});

app.listen(3000, () => console.log("3000"));
