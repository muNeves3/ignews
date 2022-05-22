import { signIn, useSession } from "next-auth/react";
import { toast, ToastContainer } from "react-toastify";
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stype-js";
import styles from "./styles.module.scss";

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const { status } = useSession();

  function handleToast(message: string) {
    toast.error(message);
  }

  async function handleSubscribe() {
    if (status !== "authenticated") {
      signIn("github");
      return;
    } else {
      try {
        const response = await api.post("/subscribe");

        console.log(response);

        const { sessionId } = response.data;

        const stripe = await getStripeJs();
        await stripe.redirectToCheckout({ sessionId });
      } catch (e) {
        handleToast(e.message);
      }
    }
  }

  return (
    <>
      <button
        type="button"
        className={styles.subscribeButton}
        onClick={() => handleSubscribe()}
      >
        Subscribe now
      </button>
    </>
  );
}
