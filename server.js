const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const mongoose = require("mongoose");

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('Uncaught Exception occured! Shutting down...');
  process.exit(1);
})

const app = require("./app");

// console.log(process.env);

//mongo

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/movie_app"
);

mongoose.connection.on("connected", () => {
  console.log("Mongoose is connected");
});

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log("server has started...");
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled rejection occured! Shutting down...');

  server.close(() => {
   process.exit(1);
  })
})
