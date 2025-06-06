// pages/api/updateStatus.ts

import { NextApiRequest, NextApiResponse } from 'next';
import sql from 'mssql';

// Copy same config from titles.ts:
const config = {
  server: 'mytitleserver12345.database.windows.net',
  database: 'titles-db',
  user: 'sqladmin',
  password: 'Gizmund2011!!!',
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { barcode, status } = req.body;

  let pool;

  try {
    pool = await sql.connect(config);

    await pool.request()
      .input('status', sql.Int, status)
      .input('barcode', sql.VarChar, barcode)
      .query('UPDATE titles SET status = @status WHERE barcode = @barcode');

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Error updating status' });
  } finally {
    // Correct: close the pool if it was created
    if (pool) {
      await pool.close();
    }
  }
}

