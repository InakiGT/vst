import mysql from 'mysql2/promise'

export const sql = mysql.createPool({
  uri: process.env.MYSQL_URI || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})
