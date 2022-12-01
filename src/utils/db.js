import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve('../../.env') });
import { MongoClient } from 'mongodb';

const uri = '';

let _db;
let client;

export default {
  connect: async () => {
    client = await MongoClient.connect(uri);
    _db = client;
  },

  get: () => _db.db(),

  close: () => {
    client.close();
  },
};
