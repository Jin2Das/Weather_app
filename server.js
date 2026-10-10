const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve frontend files from the public folder
app.use(express.static(path.join(__dirname, "public")));

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Weather app server is working!" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});