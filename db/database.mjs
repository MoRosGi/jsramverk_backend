import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import { MongoClient, ServerApiVersion } from 'mongodb';

const database = {
  getDb: async function getDb () {
      let dsn = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@text-editor.lhjsw.mongodb.net/?retryWrites=true&w=majority&appName=text-editor`;

      if (process.env.NODE_ENV === 'test') {
          dsn = "mongodb://localhost:27017/test";
      }

      const client = new MongoClient(dsn, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });

      const db = await client.db();
      const collection = await db.collection("documents");

      return {
          collection: collection,
          client: client,
      };
  }
};

export default database;
