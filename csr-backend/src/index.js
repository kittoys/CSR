const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const programRoutes = require("./routes/programs");
const categoryRoutes = require("./routes/categories");
const proposalRoutes = require("./routes/proposals");
const uploadRoutes = require("./routes/upload");

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req, res) => {
  res.json({ message: "CSR API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/proposals", proposalRoutes);
app.use("/api/upload", uploadRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
