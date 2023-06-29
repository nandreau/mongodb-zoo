import express from 'express'
import bodyParser from 'body-parser'
import productRouter from './routes/products.js'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import { MongoClient } from 'mongodb'

async function main() {
    const app = express()
    const options = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: "ESGI B3 AL Express API with Swagger",
                version: "0.1.0",
                description:
                    "This is a simple CRUD API application made with Express and documented with Swagger",
                license: {
                    name: "MIT",
                    url: "https://spdx.org/licenses/MIT.html",
                },
                contact: {
                    name: "ESGI",
                    url: "",
                    email: "ESGI@ESGI.com",
                },
            },
            servers: [
                {
                    url: "http://localhost:3000",
                },
            ],
        },
        apis: ["./routes/*.js"],
    };

    const specs = swaggerJsdoc(options);
    const url = 'mongodb://localhost:27017';
    const client = new MongoClient(url);
    app.use(
        "/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(specs)
    );
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }))

    app.use('/products', productRouter)
    // CRUD create read update (delete)

    // on ne peut avoir qu'un seul couple methode/route par app
    app.get('/', (req, res, next) => {
        res.send('Hello ESGI')
    })
    await client.connect();
    console.log('Connected successfully to server');

  
    // the following code examples can be pasted here...
    app.listen(3000)
}

main() 