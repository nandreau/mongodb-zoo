import express from 'express';
import { connectToDatabase } from '../db.js';

const collectionPromise = connectToDatabase('data');
const router = express.Router();

router.use(express.json());

/**
 * @swagger
 * definitions:
 *   Data:
 *     properties:
 *       text:
 *         type: string
 */

/**
 * @swagger
 * /:
 *   get:
 *     description: Obtenir toutes les entrées de données.
 *     responses:
 *       200:
 *         description: Renvoie un tableau des entrées de données.
 *       400:
 *         description: Requête invalide.
 *       404:
 *         description: Aucune entrée de données trouvée.
 */
router.get('/', async (req, res) => {
  const collection = await collectionPromise;
  try {
    const datas = await collection.find().toArray();
    if (datas.length > 0) {
      res.json(datas);
    } else {
      res.status(404).json({ error: 'Aucune entrée de données trouvée' });
    }
  } catch (error) {
    if (error instanceof MongoServerError) {
      console.log(`Erreur : ${error}`);
    }
    res.status(400).json({ error: 'Requête invalide' });
  }
});

/**
 * @swagger
 * /create-data:
 *   post:
 *     description: Créer une nouvelle entrée de données.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Data'
 *     responses:
 *       200:
 *         description: Renvoie le résultat de la création de données.
 *       400:
 *         description: Corps de la requête invalide.
 */
router.post('/create-data', async (req, res) => {
  const collection = await collectionPromise;
  try {
    const insertResult = await collection.insertOne({ text: req.body.text });
    res.json(insertResult);
  } catch (error) {
    if (error instanceof MongoServerError) {
      console.log(`Erreur : ${error}`);
    }
    res.status(400).json({ error: 'Corps de la requête invalide' });
  }
});

/**
 * @swagger
 * /update-data:
 *   put:
 *     description: Mettre à jour une entrée de données par ID.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Data'
 *     responses:
 *       200:
 *         description: Renvoie un message de réussite.
 *       400:
 *         description: Requête invalide.
 *       404:
 *         description: Entrée de données introuvable.
 */
router.put('/update-data', async (req, res) => {
  const collection = await collectionPromise;
  const id = req.body.id;
  const text = req.body.text;
  if (!id || !text) {
    res.status(400).json({ error: 'Corps de la requête invalide' });
  } else {
    try {
      const updateResult = await collection.findOneAndUpdate(
        { _id: ObjectId(id) },
        { $set: { text } }
      );
      if (updateResult.value) {
        res.send('Mise à jour réussie !');
      } else {
        res.status(404).json({ error: 'Entrée de données introuvable' });
      }
    } catch (error) {
      if (error instanceof MongoServerError) {
        console.log(`Erreur : ${error}`);
      }
      res.status(400).json({ error: 'Requête invalide' });
    }
  }
});

/**
 * @swagger
 * /delete-data:
 *   delete:
 *     description: Supprimer une entrée de données par ID.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               id:
 *                 type: string
 *             example:
 *               id: string
 *     responses:
 *       200:
 *         description: Renvoie un message de réussite ou d'échec.
 *       400:
 *         description: Requête invalide.
 *       404:
 *         description: Entrée de données introuvable.
 */
router.delete('/delete-data', async (req, res) => {
  const collection = await collectionPromise;
  const id = req.body.id;
  if (!id) {
    res.status(400).json({ error: 'Corps de la requête invalide' });
  } else {
    try {
      const deleteResult = await collection.deleteOne({ _id: ObjectId(id) });
      if (deleteResult.deletedCount > 0) {
        res.send('Les données ont été supprimées');
      } else {
        res.status(404).json({ error: 'Entrée de données introuvable' });
      }
    } catch (error) {
      if (error instanceof MongoServerError) {
        console.log(`Erreur : ${error}`);
      }
      res.status(400).json({ error: 'Requête invalide' });
    }
  }
});

export default router;
