const express = require('express');
const snowflake = require('snowflake-sdk');
const cors = require('cors'); // To avoid CORS issues when communicating with the frontend

const app = express();
const port = process.env.PORT || 3001;

// Enable CORS to allow frontend (React) to communicate with backend
app.use(cors());

// Configure Snowflake connection
let connection;
let isConnected = false; // Track the connection status

// Function to create a new Snowflake connection
function createConnection() {
  connection = snowflake.createConnection({
    account: 'ianwqkc-yrb30082',
    username: 'jobo',
    password: 'carmel0wore22inH$',
    warehouse: 'COMPUTE_WH',
    database: 'CJ_DB',
    schema: 'WEBAPP_STG',
    role: 'ACCOUNTADMIN',
  });

  connection.connect((err, conn) => {
    if (err) {
      console.error('Unable to connect to Snowflake:', err.message);
      isConnected = false;
    } else {
      console.log('Successfully connected to Snowflake.');
      isConnected = true;
    }
  });

  connection.on('error', (err) => {
    console.error('Connection error:', err.message);
    isConnected = false; // Mark connection as inactive
    console.log('Reconnecting to Snowflake...');
    createConnection(); // Recreate the connection
  });
}

// Helper function to ensure connection is live before executing queries
async function executeQuery(query, binds = []) {
  if (!isConnected) {
    console.log('Reconnecting to Snowflake...');
    createConnection();
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for reconnection
  }

  return new Promise((resolve, reject) => {
    connection.execute({
      sqlText: query,
      binds,
      complete: (err, stmt, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      },
    });
  });
}

// Keep the connection alive with periodic lightweight queries
function startKeepAlive() {
  setInterval(async () => {
    if (isConnected) {
      try {
        await executeQuery('SELECT 1');
        console.log('Keep-alive query executed successfully.');
      } catch (err) {
        console.error('Keep-alive query failed:', err.message);
        createConnection(); // Reconnect if the keep-alive query fails
      }
    }
  }, 3600000); // Every 1 hour
}

// Initialize Snowflake connection and keep-alive logic
createConnection();
startKeepAlive();

// Routes
app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.get('/api/spas', async (req, res) => {
  const query = `
    SELECT * FROM inventory
    WHERE product_type = 'Spa'
  `;

  try {
    const rows = await executeQuery(query);
    res.json(rows);
  } catch (err) {
    console.error('Failed to execute query:', err.message);
    res.status(500).send('Error fetching spa products');
  }
});

app.get('/api/spas/:productName', async (req, res) => {
  const productName = req.params.productName;
  const query = `
    SELECT * FROM inventory
    WHERE product_name = ?
  `;

  try {
    const rows = await executeQuery(query, [productName]);
    if (rows.length === 0) {
      res.status(404).send('Spa product not found');
    } else {
      res.json(rows[0]);
    }
  } catch (err) {
    console.error('Failed to execute query:', err.message);
    res.status(500).send('Error fetching spa product details');
  }
});

app.get('/api/swimspas', async (req, res) => {
  const query = `
    SELECT * FROM inventory
    WHERE product_type = 'Swim Spa'
  `;

  try {
    const rows = await executeQuery(query);
    res.json(rows);
  } catch (err) {
    console.error('Failed to execute query:', err.message);
    res.status(500).send('Error fetching swim spa products');
  }
});

app.get('/api/swimspas/:productName', async (req, res) => {
  const productName = req.params.productName;
  const query = `
    SELECT * FROM inventory
    WHERE product_name = ?
  `;

  try {
    const rows = await executeQuery(query, [productName]);
    if (rows.length === 0) {
      res.status(404).send('Swim spa product not found');
    } else {
      res.json(rows[0]);
    }
  } catch (err) {
    console.error('Failed to execute query:', err.message);
    res.status(500).send('Error fetching swim spa product details');
  }
});

app.get('/api/gazebos', async (req, res) => {
  const query = `
    SELECT * FROM inventory
    WHERE product_type = 'Gazebo'
  `;

  try {
    const rows = await executeQuery(query);
    res.json(rows);
  } catch (err) {
    console.error('Failed to execute query:', err.message);
    res.status(500).send('Error fetching gazebo products');
  }
});

app.get('/api/gazebos/:productName', async (req, res) => {
  const productName = req.params.productName;
  const query = `
    SELECT * FROM inventory
    WHERE product_name = ?
  `;

  try {
    const rows = await executeQuery(query, [productName]);
    if (rows.length === 0) {
      res.status(404).send('Gazebo product not found');
    } else {
      res.json(rows[0]);
    }
  } catch (err) {
    console.error('Failed to execute query:', err.message);
    res.status(500).send('Error fetching gazebo product details');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});

