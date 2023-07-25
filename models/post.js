import { connectToDatabase } from './db.js';

let Post; // Declare the Post variable outside the main function

async function main() {
  try {
    const postCollection = await connectToDatabase('posts');

    const postSchema = {
      title: {
        type: String,
        required: true
      },
      imageUrl: {
        type: String,
        required: true
      },
      content: {
        type: String,
        required: true
      },
      creator: {
        type: Object,
        required: true
      }
    };

    Post = database.model('Post', postSchema, postCollection); // Assign the Post model to the variable

  } catch (error) {
    console.error('Erreur de connexion à la base de données : ', error);
    throw error;
  }
}

main();

export { Post }; // Export the Post model after the main function