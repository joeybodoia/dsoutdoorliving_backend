const express = require('express');
const snowflake = require('snowflake-sdk');
const cors = require('cors'); // To avoid CORS issues when communicating with the frontend

const app = express();
const port = process.env.PORT || 3001;

// Enable CORS to allow frontend (React) to communicate with backend
app.use(cors());

// Configure Snowflake connection
const connection = snowflake.createConnection({
  account: 'ianwqkc-yrb30082',
  username: 'jobo',
  password: 'carmel0wore22inH$',
  warehouse: 'COMPUTE_WH',
  database: 'CJ_DB',
  schema: 'WEBAPP_STG',
  role: 'ACCOUNTADMIN'
});

// Connect to Snowflake
connection.connect((err, conn) => {
  if (err) {
    console.error('Unable to connect to Snowflake:', err);
  } else {
    console.log('Successfully connected to Snowflake.');
  }
});


app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.get('/api/spas', (req, res) => {
  const query = `
    SELECT * FROM inventory
    WHERE product_type = 'Spa'
  `;

  connection.execute({
    sqlText: query,
    complete: (err, stmt, rows) => {
      if (err) {
        console.error('Failed to execute query:', err.message);
        res.status(500).send('Error fetching spa products');
      } else {
        res.json(rows); // Send data as JSON response
      }
    }
  });
});



// New route to get a specific spa product by name
app.get('/api/spas/:productName', (req, res) => {
  const productName = req.params.productName; // Get productName from URL parameters

  const query = ` 
    SELECT * FROM inventory
    WHERE product_name = ?  -- Use ? for binding
  `;

  connection.execute({
    sqlText: query,
    binds: [productName], // Bind the product name as an array
    complete: (err, stmt, rows) => {
      if (err) {
        console.error('Failed to execute query:', err.message);
        res.status(500).send('Error fetching spa product details');
      } else if (rows.length === 0) {
        res.status(404).send('Spa product not found');
      } else {
        res.json(rows[0]); // Send the first row as JSON response (single product)
      }   
    }   
  }); 
});

// Route to get all swim spa products
app.get('/api/swimspas', (req, res) => {
  const query = ` 
    SELECT * FROM inventory
    WHERE product_type = 'Swim Spa'  -- Adjust this to match your data structure
  `;

  connection.execute({
    sqlText: query,
    complete: (err, stmt, rows) => {
      if (err) {
        console.error('Failed to execute query:', err.message);
        res.status(500).send('Error fetching swim spa products');
      } else {
        res.json(rows); // Send data as JSON response
      }   
    }   
  }); 
});

// New route to get a specific swim spa product by name
app.get('/api/swimspas/:productName', (req, res) => {
  const productName = req.params.productName; // Get productName from URL parameters

  const query = ` 
    SELECT * FROM inventory
    WHERE product_name = ?  -- Use ? for binding
  `;

  connection.execute({
    sqlText: query,
    binds: [productName], // Bind the product name as an array
    complete: (err, stmt, rows) => {
      if (err) {
        console.error('Failed to execute query:', err.message);
        res.status(500).send('Error fetching swim spa product details');
      } else if (rows.length === 0) {
        res.status(404).send('Swim spa product not found');
      } else {
        res.json(rows[0]); // Send the first row as JSON response (single product)
      }   
    }   
  }); 
});


// Route to get all gazebo
app.get('/api/gazebos', (req, res) => {
  const query = `
    SELECT * FROM inventory
    WHERE product_type = 'Gazebo'  -- Adjust this to match your data structure
  `;

  connection.execute({
    sqlText: query,
    complete: (err, stmt, rows) => {
      if (err) {
        console.error('Failed to execute query:', err.message);
        res.status(500).send('Error fetching swim spa products');
      } else {
        res.json(rows); // Send data as JSON response
      }
    }
  });
});

// New route to get a specific swim spa product by name
app.get('/api/gazebos/:productName', (req, res) => {
  const productName = req.params.productName; // Get productName from URL parameters

  const query = `
    SELECT * FROM inventory
    WHERE product_name = ?  -- Use ? for binding
  `;

  connection.execute({
    sqlText: query,
    binds: [productName], // Bind the product name as an array
    complete: (err, stmt, rows) => {
      if (err) {
        console.error('Failed to execute query:', err.message);
        res.status(500).send('Error fetching swim spa product details');
      } else if (rows.length === 0) {
        res.status(404).send('Swim spa product not found');
      } else {
        res.json(rows[0]); // Send the first row as JSON response (single product)
      }
    }
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});

