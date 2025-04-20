const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'your_mysql_user',
  password: 'your_mysql_password',
  database: 'recipe_db'
});

connection.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL database!');
});

module.exports = connection;
