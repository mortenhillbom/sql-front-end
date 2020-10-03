import { NextApiRequest, NextApiResponse } from "next";
import * as db from "db";

export const tableNames = async (
  _: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const tables = await db.getTables();
  res.json({ items: tables });
};

export default tableNames;
