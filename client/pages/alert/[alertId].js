import { useRouter } from "next/router";

const AlertItem = () => {
  const {
    query: { alertId },
  } = useRouter();
  return (
    <div>
      <h1>Alert Item: {alertId}</h1>
    </div>
  );
};

export default AlertItem;
