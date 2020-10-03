import { NextApiRequest, NextApiResponse } from "next";
import * as db from "db";

export const resetDb = async (_: NextApiRequest, res: NextApiResponse) => {
  const resetResponse = await db.resetDb();
  if (!resetResponse.success) res.statusCode = 500;
  res.json(resetResponse);
};

export default resetDb;
