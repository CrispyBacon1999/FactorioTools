import Head from "next/head";
import Nav from "@/common/components/Nav/Navbar";

import "@/common/style/index.css";

export default function FactorioTools({
  Component,
  pageProps,
}: {
  Component: any;
  pageProps: any;
}) {
  return (
    <>
      <Head>
        <link
          rel='stylesheet'
          href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap'
        />
        <link
          rel='stylesheet'
          href='https://fonts.googleapis.com/icon?family=Material+Icons'
        />
      </Head>
      <Nav>
        <Component {...pageProps} />
      </Nav>
    </>
  );
}
