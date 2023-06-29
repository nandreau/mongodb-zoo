import express from "express";
import { MongoClient, MongoServerError } from 'mongodb'

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'ZOO';
const db = client.db(dbName);
const collection = db.collection('data');

const router = express.Router();
router.use(express.json());

/**
 * @openapi
 * /:
 *   get:
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
router.post('/create-data', async (req, res) => {
    // Sending request to create a data
    try {
        const insertResult = await collection.insertOne({ text: req.body.text });
        console.log (req.body.text, insertResult)
        res.json(insertResult)
      } catch (error) {
        if (error instanceof MongoServerError) {
          console.log(`Erreur : ${error}`);
        }
        throw error;
    }
})

router.get('/', async (req, res) => {
    try {
        const datas = await collection.find().toArray();
        console.log (req.body.text, datas)
        res.json(datas)
      } catch (error) {
        if (error instanceof MongoServerError) {
          console.log(`Erreur : ${error}`); 
        }
        throw error;
    }
})

router.put('/update-data', async (req, res) => {
    // updating a data by it's ID and new value
    db.collection('data').findOneAndUpdate(
        { _id: new mongodb.ObjectId(req.body.id) },
        { $set: { text: req.body.text } },
        function () {
        res.send('Success updated!')
        }
    )
})

router.delete('/delete-data', async (req, res) => {
    // deleting a data by it's ID
    try {
        const datas = await collection.deleteOne({ _id: req.body.id });
        console.log(req, datas)
        if (datas.deletedCount > 0) {
            res.send('La donnée a bien été supprimé')
        } else {
            res.send('Aucune donnée n\'a été supprimé')
        }
      } catch (error) {
        if (error instanceof MongoServerError) {
          console.log(`Erreur : ${error}`);
        }
        throw error;
    }
})

export default router;