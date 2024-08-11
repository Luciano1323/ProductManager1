// src/swagger.js
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Product Manager API",
      version: "1.0.0",
      description: "API documentation for Product Manager",
      contact: {
        name: "Your Name",
        email: "your.email@example.com",
      },
      servers: ["http://localhost:3000"],
    },
  },
  apis: ["./src/routes/*.js"], // Ruta donde tienes tus archivos de rutas
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
