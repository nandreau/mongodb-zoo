import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../db.js';

class User {
  constructor(email, password, name, status = 'I am new!', posts = []) {
    this.email = email;
    this.password = password;
    this.name = name;
    this.status = status;
    this.posts = posts.map(postId => ObjectId(postId)); // Convert post IDs to ObjectId instances
  }

  save() {
    return connectToDatabase('users').then(collection => collection.insertOne(this));
  }

  static findByEmail(email) {
    return connectToDatabase('users').then(collection => collection.findOne({ email }));
  }

  static findById(userId) {
    return connectToDatabase('users').then(collection => collection.findOne({ _id: ObjectId(userId) }));
  }
}

export default User;