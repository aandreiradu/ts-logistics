import axios from "axios";
import { isAmountValid } from "./utils/peer.guards";

class PeerRelationship {
  balance: number = 0;
  receiver: number = 3000;

  constructor(receiver: number) {
    this.receiver = receiver;
  }

  async pay(amount: number) {
    isAmountValid(amount);

    await axios({
      method: "POST",
      url: `http://localhost:${this.receiver}/`,
      data: {
        type: "receive",
        data: {
          amount,
        },
      },
    });

    this.balance -= amount;
  }

  receive(amount: number): void {
    isAmountValid(amount);

    this.balance += amount;
  }

  get _balance(): number {
    return this.balance;
  }
}

export default PeerRelationship;
