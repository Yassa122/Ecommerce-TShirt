// pages/_document.tsx

import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#2196f3" />
          <meta name="description" content="PWA application with Next 13" />
          <meta name="keywords" content="nextjs, nextjs13, next13, pwa, next-pwa" />
          <link rel="apple-touch-icon" href="/icons/icon-128x128.png" />
          <link rel="icon" href="/icons/icon-128x128.png" />
          {/* Additional global styles or fonts */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
