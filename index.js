import express from 'express'
import bodyParser from 'body-parser'
import productRouter from './routes/feed.js'
import authRoutes from './routes/auth.js'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'

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
    // Middleware to set up CORS headers
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
        );
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        next();
    });

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
    app.use('/feed', productRouter);
    app.use('/auth', authRoutes);
  
    // Error handling middleware
    app.use((error, req, res, next) => {
        console.log(error); // Log the error for debugging
        const status = error.statusCode || 500;
        const message = error.message;
        const data = error.data;
        res.status(status).json({ message: message, data: data }); // Respond with error message and status code
    });
  
    app.listen(3000, () => {
      console.log('Server listening on port 3000');
    });
}

main() 