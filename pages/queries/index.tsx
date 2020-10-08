/* eslint-disable no-use-before-define */
import { Spin } from "antd";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home(): JSX.Element {
  const router = useRouter();

  useEffect(() => {
    router.push("queries/new");
  });

  return <Spin />;
}
