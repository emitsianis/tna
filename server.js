const express = require("express");
const connectDB = require("./config/db");
const path = require("path");

const app = express();

connectDB();

//Init middleware
app.use(express.json({ extended: false }));

//Define routes
app.use("/api/auth", require("./routes/auth.routes"));

// app.use(express.static("client/dist/client"));

// app.get("*", (req, res) => {
//   res.sendFile(
//     path.resolve(__dirname, "client", "dist", "client", "index.html")
//   );
// });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
