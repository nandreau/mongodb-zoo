import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../db.js';

const collectionPromise = connectToDatabase('users');

class User {
  constructor(email, password, name, status = 'I am new!', posts = []) {
    this.email = email;
    this.password = password;
    this.name = name;
    this.status = status;
    this.posts = posts.map(postId => ObjectId(postId)); // Convert post IDs to ObjectId instances
  }

  async save() {
    const collection = await collectionPromise;
    const result = await collection.insertOne(this);
    this._id = result.insertedId;
    return result;
  }

  static findByEmail(email) {
    return collectionPromise.then(collection => collection.findOne({ email }));
  }

  static findById(userId) {
    return collectionPromise.then(collection => collection.findOne({ _id: ObjectId(userId) }));
  }

  static findOne(query) {
    return collectionPromise.then(collection => collection.findOne(query));
  }
}

export default User;
