import styles from "./styles.module.scss";

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const isUserLoggedIn = false;

  return (
    <button type="button" className={styles.subscribeButton}>
      Subscribe now
    </button>
  );
}
