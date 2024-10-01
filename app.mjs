import 'dotenv/config'

const port = process.env.PORT || 3000;

import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';

import documentRoutes from "./routes/documentRoutes.mjs";

const app = express();

app.disable('x-powered-by');
app.set("view engine", "ejs");

app.use(cors());
app.use(express.static(path.join(process.cwd(), "public")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

app.use("/documents", documentRoutes);

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
