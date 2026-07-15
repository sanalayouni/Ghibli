const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const commentRoutes = require("./routes/comment.routes");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

mongoose.connect(process.env.DATABASE)
.then(() => console.log("Connected to DB"))
.catch(err => console.log(err));

app.use("/auth", authRoutes);
app.use("/users", require("./routes/user.routes"));
app.use("/admin", require("./routes/admin.routes"));
app.use("/api", commentRoutes);
app.listen(3000, () => console.log("Server running"));
