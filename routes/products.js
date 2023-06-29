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
 * @swagger
 * /create-data:
 *   post:
 *     description: Create a new data entry.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Data'
 *     responses:
 *       200:
 *         description: Returns the result of the data creation.
 *       400:
 *         description: Invalid request body.
 */
router.post('/create-data', async (req, res) => {
  try {
    const insertResult = await collection.insertOne({ text: req.body.text });
    console.log(req.body.text, insertResult);
    res.json(insertResult);
  } catch (error) {
    if (error instanceof MongoServerError) {
      console.log(`Erreur : ${error}`);
    }
    res.status(400).json({ error: 'Invalid request body' });
  }
});

/**
 * @swagger
 * /:
 *   get:
 *     description: Get all data entries.
 *     responses:
 *       200:
 *         description: Returns an array of data entries.
 *       400:
 *         description: Invalid request.
 *       404:
 *         description: No data entries found.
 */
router.get('/', async (req, res) => {
  try {
    const datas = await collection.find().toArray();
    console.log(req.body.text, datas);
    if (datas.length > 0) {
      res.json(datas);
    } else {
      res.status(404).json({ error: 'No data entries found' });
    }
  } catch (error) {
    if (error instanceof MongoServerError) {
      console.log(`Erreur : ${error}`);
    }
    res.status(400).json({ error: 'Invalid request' });
  }
});

/**
 * @swagger
 * /update-data:
 *   put:
 *     description: Update a data entry by ID.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Data'
 *     responses:
 *       200:
 *         description: Returns a success message.
 *       400:
 *         description: Invalid request.
 *       404:
 *         description: Data entry not found.
 */
router.put('/update-data', async (req, res) => {
  const id = req.body.id;
  const text = req.body.text;
  if (!id || !text) {
    res.status(400).json({ error: 'Invalid request body' });
  } else {
    try {
      const updateResult = await collection.findOneAndUpdate(
        { _id: ObjectId(id) },
        { $set: { text } }
      );
      if (updateResult.value) {
        res.send('Success updated!');
      } else {
        res.status(404).json({ error: 'Data entry not found' });
      }
    } catch (error) {
      if (error instanceof MongoServerError) {
        console.log(`Erreur : ${error}`);
      }
      res.status(400).json({ error: 'Invalid request' });
    }
  }
});

/**
 * @swagger
 * /delete-data:
 *   delete:
 *     description: Delete a data entry by ID.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               id:
 *                 type: string
 *             example:
 *               id: "6065d5e5afafab0d1c86ec1a"
 *     responses:
 *       200:
 *         description: Returns a success or failure message.
 *       400:
 *         description: Invalid request.
 *       404:
 *         description: Data entry not found.
 */
router.delete('/delete-data', async (req, res) => {
  const id = req.body.id;
  if (!id) {
    res.status(400).json({ error: 'Invalid request body' });
  } else {
    try {
      const deleteResult = await collection.deleteOne({ _id: ObjectId(id) });
      if (deleteResult.deletedCount > 0) {
        res.send('La donnée a bien été supprimée');
      } else {
        res.status(404).json({ error: 'Data entry not found' });
      }
    } catch (error) {
      if (error instanceof MongoServerError) {
        console.log(`Erreur : ${error}`);
      }
      res.status(400).json({ error: 'Invalid request' });
    }
  }
});

export default router;