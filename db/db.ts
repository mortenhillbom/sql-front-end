import { Pool, QueryResult, types } from "pg";

const localPgConfig = {
  max: 1,
  user: "postgres",
  password: "postgres",
  database: "postgres",
  host: "localhost",
};

const DB_SETUP_SCRIPT_URL =
  "https://gist.github.com/mortenhillbom/825afa949b6187e047772a6a025994cf/raw/117c11dd37c28c12e7348ed7557f31b74ba38add/shakespear.sql";

const bytArrayParse = (val: string) => {
  return val.replace("\\", "0");
};

types.setTypeParser(types.builtins.BYTEA, bytArrayParse);

const pool = new Pool(localPgConfig);

pool.on("error", (err): void => {
  // eslint-disable-next-line no-console
  console.error("Unexpected error", err);
});

export const sqlQuery = async (queryString: string): Promise<QueryResult> =>
  pool.query(queryString);

const tableNamesQuery = `SELECT table_name
                        FROM information_schema.tables
                        WHERE table_schema='public'
                        AND table_type='BASE TABLE';`;

export const getTables = async (): Promise<string[]> => {
  const { rows } = await sqlQuery(tableNamesQuery);
  return rows.map((t) => t.table_name);
};

export const resetDb = async (): Promise<{
  success: boolean;
  error?: string;
}> => {
  const setUpQuery = await fetch(DB_SETUP_SCRIPT_URL).then((res) => res.text());
  try {
    await sqlQuery(setUpQuery);
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
};
