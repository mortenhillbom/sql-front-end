import "../styles/globals.css";
import "../styles/antd.less";

import type { AppProps /* , AppContext */ } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
