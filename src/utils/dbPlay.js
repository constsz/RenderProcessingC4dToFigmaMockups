import mongo from './db.js';

(async () => {
  await mongo.connect();
  const db = await mongo.get();
  const prods = await db.collection('products').findOne();
  console.log(prods);

  mongo.close();
})();
