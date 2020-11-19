/* eslint-disable no-use-before-define */
import { Button, Empty, message, Table, Alert, Select } from "antd";
import { ColumnProps } from "antd/lib/table";
import Title from "antd/lib/typography/Title";
import QueryEditor from "components/QueryEditor";
import Head from "next/head";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Resizable } from "re-resizable";
import { useRouter } from "next/router";
import useLocalStorage from "hooks/useLocalStorage";

type ResultRow = { [key: string]: string | number | any };

interface Queries {
  [key: string]: { query: string; id: string };
}
const BASE_URL = "http://localhost:3000/api";

const parseTableColumns = (sampleRow: any) =>
  Object.keys(sampleRow).map((col) => ({
    title: col,
    dataIndex: col,
    key: col,
    render: (rowData) =>
      typeof rowData === "object" ? JSON.stringify(rowData) : rowData,
  }));

export default function Home(): JSX.Element {
  const router = useRouter();
  const { queryId } = router.query;

  const [userQuery, setUserQuery] = useState<string>("");
  const [resultRows, setResultRows] = useState<ResultRow[]>([]);
  const [columns, setColumns] = useState<ColumnProps<ResultRow>[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isResettingDB, setIsResettingDB] = useState<boolean>(false);

  const [savedQueries, setSavedQueries] = useLocalStorage<Queries>(
    "queries",
    {}
  );

  const getNextId = (): string => {
    if (queryId && queryId !== "new") return String(queryId);
    const currentHighest = Math.max(
      ...Object.keys(savedQueries).map((n) => parseInt(n, 10)),
      0
    );
    return String(currentHighest + 1);
  };

  const handleSave = (queryToStore: string, id: string) => {
    setSavedQueries({
      ...savedQueries,
      [id]: { query: queryToStore, id },
    });
    router.push(id);
  };

  const handleResetDB = async () => {
    setIsResettingDB(true);
    const { success, error } = await (
      await fetch(`${BASE_URL}/reset-db`)
    ).json();
    if (success) {
      message.success("DB reset successful");
    } else {
      message.error(error);
    }
    setIsResettingDB(false);
  };

  const handleRunQuery = async () => {
    const res = await fetch(`${BASE_URL}/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sqlQuery: userQuery }),
    });
    const { items: rows, error } = await res.json();

    if (error) {
      setErrorMessage(error);
    } else if (rows) {
      setErrorMessage("");
      setResultRows(rows);
    }
  };

  useEffect(() => {
    if (queryId === "new") {
      setUserQuery("");
    } else {
      setUserQuery(savedQueries[String(queryId)]?.query);
    }
  }, [queryId]);

  useEffect(() => {
    if (!resultRows.length) {
      setColumns([]);
    } else {
      const newColumns = parseTableColumns(resultRows[0]);
      setColumns(newColumns);
    }
  }, [resultRows]);

  return (
    <Container>
      <Head>
        <title>SQL front end</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <TitleWrapper>
        <Title>SQL Explorer</Title>
        <Button
          loading={isResettingDB}
          onClick={handleResetDB}
          type="primary"
          danger
        >
          Reset DB
        </Button>
      </TitleWrapper>
      <Content>
        <QueryWrapper>
          <Toolbar>
            <Select
              value={queryId}
              onChange={(goToId) => router.push(`${goToId}`)}
              style={{ width: "100%" }}
            >
              {Object.values(savedQueries).map((q) => (
                <Select.Option value={q.id} key={q.id}>
                  {q.id}
                </Select.Option>
              ))}
              <Select.Option value="new" key="new">
                + New query
              </Select.Option>
            </Select>
            <Button
              onClick={() => handleSave(userQuery, getNextId())}
              type="primary"
            >
              Save
            </Button>
          </Toolbar>
          <QueryEditor query={userQuery} setQuery={setUserQuery} />
          <Button onClick={handleRunQuery} type="primary" size="large">
            Run query
          </Button>
        </QueryWrapper>
        <Resizable
          defaultSize={{
            width: "60%",
            height: "100%",
          }}
          maxWidth="98vw"
          minWidth="12"
          enable={{
            top: false,
            right: false,
            bottom: false,
            left: true,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false,
          }}
          style={{ display: "flex" }}
        >
          <ResizeBorder>||</ResizeBorder>
          <ResultWrapper>
            {errorMessage && <Alert type="error" message={errorMessage} />}
            {columns.length ? (
              <Table<ResultRow>
                scroll={{ x: "auto", y: "auto" }}
                columns={columns}
                dataSource={resultRows}
              />
            ) : (
              <Empty description="No query results" style={{ margin: 40 }} />
            )}
          </ResultWrapper>
        </Resizable>
      </Content>
    </Container>
  );
}

const Toolbar = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Container = styled.div`
  min-height: 100vh;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: left;
`;
const TitleWrapper = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const QueryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const ResultWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 8px;
  width: 100%;
  overflow: scroll;
  height: 100%;
`;

const Content = styled.div`
  border-top: 5px solid #efefef;
  display: flex;
  flex-direction: row;
  height: calc(100vh - 97px);
`;

const ResizeBorder = styled.div`
  width: 12px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: -1px;
  color: black;
  background: #efefef;
  user-select: none;
`;
