import { Button, message, Table } from "antd";
import TextArea from "antd/lib/input/TextArea";
import Title from "antd/lib/typography/Title";
import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

type ResultRow = { [key: string]: string | number };

export default function Home(): JSX.Element {
  const [tables, setTables] = useState<any>("nothing");
  const [userQuery, setUserQuery] = useState<string>("");
  const [resultRows, setResultRows] = useState<ResultRow[]>([]);

  const handleDB = async () => {
    const { items: newTables } = await (await fetch("api/table-names")).json();
    setTables(newTables);
  };

  const handleResetDB = async () => {
    const { success, error } = await (await fetch("api/reset-db")).json();
    if (success) {
      message.success("DB reset successful");
    } else {
      message.error(error);
    }
  };

  const handleRunQuery = async () => {
    const { items: rows } = await (
      await fetch("api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sqlQuery: userQuery }),
      })
    ).json();
    setResultRows(rows);
  };

  useEffect(() => {
    handleDB();
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>SQL front end</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Title>SQL</Title>
      <TextArea
        value={userQuery}
        onChange={(e) => setUserQuery(e.target.value)}
      />
      <Button onClick={handleResetDB}>Reset DB</Button>
      <Button onClick={handleRunQuery} type="primary">
        Run query
      </Button>
      <Table
        columns={[{ title: "One col", dataIndex: "colOne", key: "colOne" }]}
        dataSource={resultRows.map((r) => ({ colOne: r[Object.keys(r)[0]] }))}
      />
    </div>
  );
}
