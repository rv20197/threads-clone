import { SignIn } from "@clerk/nextjs";
import Head from "next/head";

export default function Page() {
  return (
     <>
        <Head>
           <title>Sign in</title>
        </Head>
        <SignIn />
     </>
  );
}