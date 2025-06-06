import { NextApiRequest, NextApiResponse } from 'next';
import sql from 'mssql';

// Config for Azure SQL connection
export const config: sql.config = {
  user: 'sqladmin',
  password: 'Gizmund2011!!!',
  server: 'mytitleserver12345.database.windows.net',
  database: 'titles-db',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let pool: sql.ConnectionPool | null = null;

  try {
    // Create connection pool and connect
    pool = await sql.connect(config);

    // Run query
    const result = await pool.request().query('SELECT * FROM titles');

    // Return the data as JSON
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error fetching titles:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    // Close the connection pool if it was created
    if (pool) {
      await pool.close();
    }
  }
}



