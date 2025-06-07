// pages/api/updateStatus.ts

import type { NextApiRequest, NextApiResponse } from "next";
import sql from "mssql";

const config = {
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  server: process.env.DB_SERVER!,   // <----- THIS IS UNDEFINED
  database: process.env.DB_NAME!,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }

  const { barcode, status } = req.body;

  try {
    const pool = await sql.connect(config);

    await pool.request()
      .input("status", sql.Int, status)
      .input("barcode", sql.NVarChar, barcode)
      .query("UPDATE titles SET status = @status WHERE barcode = @barcode");

    res.status(200).json({ message: "Status updated" });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Failed to update status" });
  }
}


