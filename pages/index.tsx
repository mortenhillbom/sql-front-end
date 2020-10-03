/* eslint-disable no-use-before-define */
import { Button, Empty, message, Table } from "antd";
import { ColumnProps } from "antd/lib/table";
import Title from "antd/lib/typography/Title";
import QueryEditor from "components/QueryEditor";
import Head from "next/head";
import { useEffect, useState } from "react";
import styled from "styled-components";
import styles from "../styles/Home.module.css";

type ResultRow = { [key: string]: string | number | any };

const parseTableColumns = (sampleRow: any) =>
  Object.keys(sampleRow).map((col) => ({
    title: col,
    dataIndex: col,
    key: col,
    render: (rowData) =>
      typeof rowData === "object" ? JSON.stringify(rowData) : rowData,
  }));

export default function Home(): JSX.Element {
  const [userQuery, setUserQuery] = useState<string>("");
  const [resultRows, setResultRows] = useState<ResultRow[]>([]);
  const [columns, setColumns] = useState<ColumnProps<ResultRow>[]>([]);

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
    if (!resultRows.length) {
      setColumns([]);
    } else {
      const newColumns = parseTableColumns(resultRows[0]);
      setColumns(newColumns);
    }
  }, [resultRows]);

  return (
    <div className={styles.container}>
      <Head>
        <title>SQL front end</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <TitleWrapper>
        <Title>SQL Explorer</Title>
        <Button onClick={handleResetDB} type="primary" danger>
          Reset DB
        </Button>
      </TitleWrapper>
      <QueryWrapper>
        <Title level={3}>Query:</Title>
        <QueryEditor query={userQuery} setQuery={setUserQuery} />
        <Button onClick={handleRunQuery} type="primary">
          Run query
        </Button>
      </QueryWrapper>
      <ResultWrapper>
        <Title level={3}>Results:</Title>
        {columns.length ? (
          <Table<ResultRow>
            scroll={{ x: "auto", y: "50vh" }}
            columns={columns}
            dataSource={resultRows}
          />
        ) : (
          <Empty style={{ margin: 40 }} />
        )}
      </ResultWrapper>
    </div>
  );
}

const TitleWrapper = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const QueryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 20vh;
  margin-bottom: 24px;
`;

const ResultWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 50vh;
`;
