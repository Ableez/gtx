import FCMComponent from "@/components/FCM";
import type { AppProps } from "next/app";

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Component {...pageProps} />
      <FCMComponent />
    </>
  );
};

export default MyApp;
