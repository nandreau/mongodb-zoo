import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../db.js';

const collectionPromise = connectToDatabase('products');

class Product {
  constructor(title, price, description) {
    this.title = title;
    this.price = price;
    this.description = description;
  }

  async save() {
    return collectionPromise.then(collection => collection.insertOne(this));
  }

  static async findById(productId) {
    return collectionPromise.then(collection => collection.findOne({ _id: new ObjectId(productId) }));
  }

  static async findAll() {
    return collectionPromise.then(collection => collection.find().toArray());
  }

  static async updateById(productId, title, price, description) {
    return collectionPromise.then(collection =>
      collection.findOneAndUpdate(
        { _id: new ObjectId(productId) },
        { $set: { title, price, description } },
        { returnOriginal: false }
      )
    );
  }

  static async deleteById(productId) {
    return collectionPromise.then(collection =>
      collection.deleteOne({ _id: new ObjectId(productId) }).then(result => result.deletedCount > 0)
    );
  }
}

export default Product;
