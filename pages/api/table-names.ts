import { NextApiRequest, NextApiResponse } from "next";
import * as db from "db";

export const tableNames = async (_: NextApiRequest, res: NextApiResponse) => {
  const tables = await db.getTables();
  res.json({ items: tables.map(t => t['table_name']) });
};

export default tableNames;
