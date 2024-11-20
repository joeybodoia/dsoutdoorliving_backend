const express = require('express');
const snowflake = require('snowflake-sdk');
const cors = require('cors'); // To avoid CORS issues when communicating with the frontend

const app = express();
const port = process.env.PORT || 3001;

// Enable CORS to allow frontend (React) to communicate with backend
app.use(cors());

// Configure Snowflake connection pool
const pool = snowflake.createPool(
  {
    account: 'ianwqkc-yrb30082',
    username: 'jobo',
    password: 'carmel0wore22inH$',
    warehouse: 'COMPUTE_WH',
    database: 'CJ_DB',
    schema: 'WEBAPP_STG',
    role: 'ACCOUNTADMIN',
  },
  {
    min: 1, // Minimum number of connections
    max: 10, // Maximum number of connections
    idleTimeoutMillis: 30000, // Timeout after 30 seconds of inactivity
  }
);

pool.on('error', (err) => {
  console.error('Snowflake Pool Error:', err.message);
});

app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Route to get all spa products
app.get('/api/spas', (req, res) => {
  const query = `
    SELECT * FROM inventory
    WHERE product_type = 'Spa'
  `;

  pool.acquire((err, connection) => {
    if (err) {
      console.error('Failed to acquire connection:', err.message);
      return res.status(500).send('Error acquiring connection');
    }

    connection.execute({
      sqlText: query,
      complete: (err, stmt, rows) => {
        pool.release(connection); // Release connection back to the pool
        if (err) {
          console.error('Failed to execute query:', err.message);
          return res.status(500).send('Error fetching spa products');
        }
        res.json(rows);
      },
    });
  });
});

// Route to get a specific spa product by name
app.get('/api/spas/:productName', (req, res) => {
  const productName = req.params.productName;

  const query = `
    SELECT * FROM inventory
    WHERE product_name = ?
  `;

  pool.acquire((err, connection) => {
    if (err) {
      console.error('Failed to acquire connection:', err.message);
      return res.status(500).send('Error acquiring connection');
    }

    connection.execute({
      sqlText: query,
      binds: [productName],
      complete: (err, stmt, rows) => {
        pool.release(connection);
        if (err) {
          console.error('Failed to execute query:', err.message);
          return res.status(500).send('Error fetching spa product details');
        }
        if (rows.length === 0) {
          return res.status(404).send('Spa product not found');
        }
        res.json(rows[0]);
      },
    });
  });
});

// Route to get all swim spa products
app.get('/api/swimspas', (req, res) => {
  const query = `
    SELECT * FROM inventory
    WHERE product_type = 'Swim Spa'
  `;

  pool.acquire((err, connection) => {
    if (err) {
      console.error('Failed to acquire connection:', err.message);
      return res.status(500).send('Error acquiring connection');
    }

    connection.execute({
      sqlText: query,
      complete: (err, stmt, rows) => {
        pool.release(connection);
        if (err) {
          console.error('Failed to execute query:', err.message);
          return res.status(500).send('Error fetching swim spa products');
        }
        res.json(rows);
      },
    });
  });
});

// Route to get all gazebos
app.get('/api/gazebos', (req, res) => {
  const query = `
    SELECT * FROM inventory
    WHERE product_type = 'Gazebo'
  `;

  pool.acquire((err, connection) => {
    if (err) {
      console.error('Failed to acquire connection:', err.message);
      return res.status(500).send('Error acquiring connection');
    }

    connection.execute({
      sqlText: query,
      complete: (err, stmt, rows) => {
        pool.release(connection);
        if (err) {
          console.error('Failed to execute query:', err.message);
          return res.status(500).send('Error fetching gazebos');
        }
        res.json(rows);
      },
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});

