import * as dotenv from 'dotenv';
dotenv.config();

import { MongoClient, ServerApiVersion } from 'mongodb';

const database = {
  getDb: async function getDb () {
      let dsn = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@text-editor.lhjsw.mongodb.net/?retryWrites=true&w=majority&appName=text-editor`;

      const client = new MongoClient(dsn, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });

      await client.connect();

      const db = await client.db();
      let collection = await db.collection("documents");

      if (process.env.NODE_ENV === 'test') {
          collection = await db.collection("test");
      }

      return {
          collection: collection,
          client: client,
      };
  }
};

export default database;
