import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';

import documentRoutes from "./routes/documentRoutes.mjs";
import authRoutes from "./routes/authRoutes.mjs";

import notFoundMiddleware from './middlewares/notFoundMiddleware.mjs';
import errorMiddleware from './middlewares/errorMiddleware.mjs';
import tokenMiddleware from './middlewares/tokenMiddleware.mjs';

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

app.use("/", authRoutes);
app.use("/documents", documentRoutes, tokenMiddleware);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

export default server;
