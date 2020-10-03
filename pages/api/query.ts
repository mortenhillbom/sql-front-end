import { NextApiRequest, NextApiResponse } from "next";
import * as db from "db";

export const query = async (req: NextApiRequest, res: NextApiResponse) => {
  const { sqlQuery } = req.body;
  const queryResult = await db.sqlQuery(sqlQuery);
  res.json({ items: queryResult.rows });
};

export default query;
