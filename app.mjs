import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import bodyParser from 'body-parser';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';

import documentRoutes from "./routes/documentRoutes.mjs";
import authRoutes from "./routes/authRoutes.mjs";
import inviteRoutes from "./routes/inviteRoutes.mjs"

import notFoundMiddleware from './middlewares/notFoundMiddleware.mjs';
import errorMiddleware from './middlewares/errorMiddleware.mjs';
import tokenMiddleware from './middlewares/tokenMiddleware.mjs';

import socketService from './services/socketService.mjs'

const port = process.env.PORT || 1337;

const app = express();

app.disable('x-powered-by');
app.set("view engine", "ejs");

app.use(cors({
  origin: "https://www.student.bth.se/~angt23/editor/#/",
  credentials: true
}));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), "public")));

app.use("/", authRoutes);
app.use("/documents", tokenMiddleware, documentRoutes);
app.use("/invite", tokenMiddleware, inviteRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "https://www.student.bth.se/~angt23/editor/#/",
    methods: ["GET", "POST", "PUT"]
  }
});

socketService(io);

const server = httpServer.listen(port, () => {
  console.log(`ssr-editor listening on port ${port}`)
});

export default server;
