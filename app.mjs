import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';

import documentRoutes from "./routes/documentRoutes.mjs";
import authRoutes from "./routes/authRoutes.mjs";

const port = process.env.PORT || 3000;
const app = express();

app.disable('x-powered-by');
app.set("view engine", "ejs");

app.use(cors());
app.use(express.static(path.join(process.cwd(), "public")));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/documents", documentRoutes);

// Move middleware to separate file and import
app.use((req, res, next) => {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
      return next(err);
  }

  res.status(err.status || 500).json({
      "errors": [
          {
              "status": err.status,
              "detail": err.message
          }
      ]
  });
});

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

export default server;
