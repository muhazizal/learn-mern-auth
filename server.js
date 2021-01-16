const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Set up Express
const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server has started on port: ${PORT}`));

// Set up Mongoose
mongoose.connect(
  process.env.MONGODB_CONNECTION_STRING,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (error) => {
    if (error) {
      console.log(error);
      throw error;
    }
    console.log("MongoDB connected");
  }
);

// Set up Routes
app.use("/users", require("./routes/userRoute"));
