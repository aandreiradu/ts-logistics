import axios, { AxiosError } from "axios";
import { isAmountValid } from "./utils/peer.guards";

class PeerRelationship {
  #balance: number = 0;
  #receiver: number;

  constructor(receiver: number) {
    this.#receiver = receiver;
  }

  async pay(amount: number) {
    // try {
    isAmountValid(amount);

    await axios({
      method: "POST",
      url: `http://localhost:${this.#receiver}/`,
      data: {
        type: "receive",
        data: {
          amount,
        },
      },
    });

    this.#balance -= amount;
    // } catch (error) {
    //   if (error instanceof Error) {
    //     console.log(error.message);
    //     return error.message;
    //   }

    //   if (error instanceof AxiosError) {
    //     console.log(error.response?.data.message);
    //     return;
    //   }

    //   console.log("Something went wrong...");
    //   return;
    // }
  }

  receive(amount: number): void {
    isAmountValid(amount);

    this.#balance += amount;
  }

  get balance(): number {
    return this.#balance;
  }
}

export default PeerRelationship;
