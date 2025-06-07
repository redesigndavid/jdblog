import favicon from "/favicon.svg";
import favicon96 from "/favicon-96x96.png";
import shortcuticon from "/favicon.ico";
import appletouchicon from "/apple-touch-icon.png";

export function Head() {
  return (
    <>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="apple-mobile-web-app-title" content="redesigndavid.com" />
      <meta name="robots" content="index, follow" />
      <link rel="icon" href={favicon} type="image/svg+xml" />
      <link rel="icon" href={favicon96} type="image/png" sizes="96x96" />
      <link rel="shortcut icon" href={shortcuticon} />
      <link rel="apple-touch-icon" sizes="180x180" href={appletouchicon} />
      <link rel="manifest" href="/site.webmanifest" />
    </>
  );
}
