const express = require('express');
const router = express.Router();
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Alakh Mart API', version: '1.0.0' }
  },
  apis: ['./src/routes/*.js']
};

const specs = swaggerJsdoc(options);
router.use('/', swaggerUi.serve, swaggerUi.setup(specs));

module.exports = router;
