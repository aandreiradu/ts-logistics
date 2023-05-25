import axios from "axios";
import { isAmountValid } from "../utils/guards";
import { PaymentServiceDTO } from "../utils/types";

const paymentServiceMock = async ({
  balance,
  amount,
  receiver,
}: PaymentServiceDTO) => {
  const amountValidity = isAmountValid(amount);

  if (!amountValidity) {
    console.log("Invalid amount.");
    return "Invalid amount.";
  }

  try {
    const responseReceiver = await axios({
      method: "POST",
      url: `http://localhost:${receiver}`,
      data: {
        type: "receive",
        data: {
          amount: amount,
        },
      },
    });

    if (responseReceiver.status === 200) {
      const { message } = responseReceiver?.data || null;

      if (!message) {
        console.log("No message received from BE");
        throw new Error("Someting went wrong :(. Try again later");
      }

      switch (message) {
        case "approved": {
          console.log(`Your ${amount}$ payment was approved`);
          balance -= amount;
          return balance;
        }

        case "Invalid amount": {
          console.log(
            `Your amount ${amount} is invalid. Please make sure your amount is a positive number`
          );
          return `Your amount ${amount} is invalid. Please make sure your amount is a positive number`;
        }

        default: {
          console.log("default reached. Unhandled message", message);
          throw new Error("Someting went wrong. Please try again");
        }
      }
    }

    throw new Error("Another status received from BE");
  } catch (error) {
    console.log("__error", error);
    if (error instanceof Error) {
      console.log(error.message);
      return;
    }

    console.log("Something went wrong :(");
    return;
  }
};

export default paymentServiceMock;
