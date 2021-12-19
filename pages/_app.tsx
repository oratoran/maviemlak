import { ChakraProvider } from "@chakra-ui/react";

import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useMemo } from "react";
import Turkish from "../locales/compiled-locales/tr.json";
import English from "../locales/compiled-locales/en.json";
import { IntlProvider } from "react-intl";
import "react-responsive-carousel/lib/styles/carousel.min.css";

function App({ Component, pageProps }: AppProps) {
  const { locale } = useRouter();
  const [shortLocale] = locale ? locale.split("-") : ["en"];

  const messages = useMemo(() => {
    switch (shortLocale) {
      case "tr":
        return Turkish;
      case "en":
        return English;
    }
  }, [shortLocale]);

  return (
    <ChakraProvider>
      <IntlProvider
        locale={shortLocale}
        messages={messages}
        onError={() => null}
      >
        <Component {...pageProps} />
      </IntlProvider>
    </ChakraProvider>
  );
}

export default App;
