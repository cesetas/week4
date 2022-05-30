import detectEthereumProvider from "@metamask/detect-provider";
import { Strategy, ZkIdentity } from "@zk-kit/identity";
import { generateMerkleProof, Semaphore } from "@zk-kit/protocols";
import { providers } from "ethers";
import Head from "next/head";
import React from "react";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import TextField from "@mui/material/TextField";

export default function Home() {
  const [logs, setLogs] = React.useState("Connect your wallet and greet!");
  const [newGreeting, setNewGreeting] = React.useState("Hello world");

  async function greet() {
    setLogs("Creating your Semaphore identity...");

    const provider = (await detectEthereumProvider()) as any;

    await provider.request({ method: "eth_requestAccounts" });

    const ethersProvider = new providers.Web3Provider(provider);
    const signer = ethersProvider.getSigner();
    const message = await signer.signMessage(
      "Sign this message to create your identity!"
    );

    const identity = new ZkIdentity(Strategy.MESSAGE, message);
    const identityCommitment = identity.genIdentityCommitment();
    const identityCommitments = await (
      await fetch("./identityCommitments.json")
    ).json();

    const merkleProof = generateMerkleProof(
      20,
      BigInt(0),
      identityCommitments,
      identityCommitment
    );

    setLogs("Creating your Semaphore proof...");

    const greeting = newGreeting;

    const witness = Semaphore.genWitness(
      identity.getTrapdoor(),
      identity.getNullifier(),
      merkleProof,
      merkleProof.root,
      greeting
    );

    const { proof, publicSignals } = await Semaphore.genProof(
      witness,
      "./semaphore.wasm",
      "./semaphore_final.zkey"
    );
    const solidityProof = Semaphore.packToSolidityProof(proof);

    const response = await fetch("/api/greet", {
      method: "POST",
      body: JSON.stringify({
        greeting,
        nullifierHash: publicSignals.nullifierHash,
        solidityProof: solidityProof,
      }),
    });

    console.log(response);

    if (response.status === 500) {
      const errorMessage = await response.text();

      setLogs(errorMessage);
    } else {
      setLogs(`Your greeting: ${greeting} is onchain :)`);
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Greetings</title>
        <meta
          name="description"
          content="A simple Next.js/Hardhat privacy application with Semaphore."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Greetings</h1>

        <p className={styles.description}>
          A simple Next.js/Hardhat privacy application with Semaphore.
        </p>

        <div className={styles.logs}>{logs}</div>

        <TextField
          required
          id="greeting"
          name="greeting"
          type="text"
          label="Your greeting"
          style={{ color: "red" }}
          onChange={(e) => setNewGreeting(e.target.value)}
          value={newGreeting}
        />
        <br />

        <div onClick={() => greet()} className={styles.button}>
          Greet
        </div>
        <br />
        <Link href="/form">
          <a>Go to form!</a>
        </Link>
      </main>
    </div>
  );
}
