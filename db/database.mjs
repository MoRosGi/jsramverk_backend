import { config } from '../config.mjs'
import { MongoClient, ServerApiVersion } from 'mongodb';

const database = {
  getDb: async function getDb () {
      let dsn = `mongodb+srv://${config.atlasUsername}:${config.atlasPassword}@text-editor.lhjsw.mongodb.net/?retryWrites=true&w=majority&appName=text-editor`;

      const client = new MongoClient(dsn, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });

      const db = await client.db();
      let collection = await db.collection("documents");

      if (config.nodeEnv === 'test') {
          collection = await db.collection("test");
      }

      return {
          collection: collection,
          client: client,
      };
  }
};

export default database;
