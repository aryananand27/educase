const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    database:process.env.DB,
    password:process.env.DB_PASSWORD,
    port:3306
});

const createtable = async () => {
    const createTablesQuery = `
    CREATE TABLE IF NOT EXISTS schools (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      address VARCHAR(255) NOT NULL,
      latitude FLOAT NOT NULL,
      longitude FLOAT NOT NULL
    );
  `;
    try {
        const [result] = await db.query(createTablesQuery);
        console.log('Table created successfully:', result);
    } catch (err) {
        console.error('Error creating table:', err);
    }
};

createtable();
module.exports = createtable;