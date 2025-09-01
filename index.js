// index.js: server entrypoint
const express = require('express');
const cors = require('cors');
const bodyParser = require('express').json;
const winston = require('winston');

const db = require('./db'); // ensure database created/connected
const customerRoutes = require('./routes/customers');
const addressRoutes = require('./routes/addresses');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(cors());
app.use(bodyParser());

// logging
const logger = winston.createLogger({ transports: [new winston.transports.Console()] });
app.use((req, res, next) => { 
  logger.info(`${req.method} ${req.url}`); 
  next(); 
});

// ✅ Root route for base URL
app.get("/", (req, res) => {
  res.send(`
    <h2>🚀 Customer Management Backend</h2>
    <p>Available endpoints:</p>
    <ul>
      <li><a href="/api/customers">/api/customers</a> - Get all customers</li>
      <li><a href="/api/customers/:id">/api/customers/:id</a> - Get a customer by ID</li>
      <li><a href="/api/addresses">/api/addresses</a> - Manage addresses</li>
    </ul>
  `);
});

// mount routes
app.use('/api/customers', customerRoutes); // customer endpoints
app.use('/api', addressRoutes);            // address-related endpoints (see routes/addresses.js)

// global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
