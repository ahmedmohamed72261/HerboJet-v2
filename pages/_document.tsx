import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" style={{ backgroundColor: '#fdf9f0' }}>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{ __html: `
          html, body {
            background-color: #fdf9f0;
            color: #1c1c16;
            margin: 0;
            padding: 0;
          }
          html.dark, html.dark body {
            background-color: #1c1c16;
            color: #e6e2d9;
          }
        ` }} />
      </Head>
      <body className="font-sans bg-background text-on-surface">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

