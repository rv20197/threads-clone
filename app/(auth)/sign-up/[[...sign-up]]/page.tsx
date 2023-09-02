import { SignUp } from "@clerk/nextjs";
import Head from "next/head";

export default function Page() {
  return (
     <>
      <Head>
        <title>Sign Up</title>
        </Head>
        <SignUp />
     </>
  );
}