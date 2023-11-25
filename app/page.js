import AskPage from "@/components/AskPage";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <meta name="theme-color" content="#32CD32" /> {/* Your desired color */}
        {/* other head elements */}
      </Head>
      <AskPage />
    </>
  );
}
