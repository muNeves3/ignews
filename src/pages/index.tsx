import { GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import { ToastContainer } from "react-toastify";
import { SubscribeButton } from "../components/SubscribeButton";
import { stripe } from "../services/stripe";
import "react-toastify/dist/ReactToastify.css";

import styles from "./home.module.scss";

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  };
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Hone | ig.news</title>
      </Head>
      <ToastContainer />
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>
            News about the <span>React</span> world.
          </h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount}/month</span>
          </p>

          <SubscribeButton priceId={product.priceId} />
        </section>

        <Image
          src="/images/avatar.svg"
          alt="Girl coding"
          width="340px"
          height="520px"
        />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve("price_1L2yV3F4HiO9EEqrncju2vYK");

  // const price = await stripe.prices.retrieve("price_1KzQ5qF4HiO9EEqrP8BbltQH", {
  //   expand: ["product"],
  // });  --> produto com todas as informações

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price.unit_amount / 100),
  };

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // 24 horas
  };
};
