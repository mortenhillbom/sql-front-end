import { NextApiRequest, NextApiResponse } from "next";
import * as db from "db";

export const query = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { sqlQuery } = req.body;
    const queryResult = await db.sqlQuery(sqlQuery);
    res.json({ items: queryResult.rows });
  } catch (error) {
    res.statusCode = 500;
    res.json({ error: String(error) });
  }
};

export default query;
