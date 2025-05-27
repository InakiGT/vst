import mysql from 'mysql2/promise'

export const sql = mysql.createPool({
  uri: process.env.MYSQL_URI || 'mysql://my_user:my_password@localhost:3306/my_database',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})
