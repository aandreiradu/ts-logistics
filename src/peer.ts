import axios from "axios";
import { isAmountValid } from "./utils/peer.guards";

class PeerRelationship {
  balance: number = 0;
  receiver: number = 3000;
  pendingRequestAmount: number = 0;

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
    console.log(`You\'ve sent ${amount}$`);
  }

  receive(amount: number): void {
    isAmountValid(amount);

    this.balance += amount;
  }

  get _balance(): number {
    return this.balance;
  }

  setPendingRequest(amount: number) {
    isAmountValid(amount);

    this.pendingRequestAmount = amount;
  }

  get retrievePendingAmount(): number {
    if (!this.pendingRequestAmount || this.pendingRequestAmount === 0) {
      throw new Error("No pending requests found.");
    }

    return this.pendingRequestAmount;
  }

  cancelPendingRequest() {
    this.pendingRequestAmount = 0;
  }

  async request(amount: number) {
    isAmountValid(amount);

    const response = await axios({
      method: "POST",
      url: `http://localhost:${this.receiver}/`,
      data: {
        type: "request",
        data: {
          amount,
        },
      },
    });

    console.log("response", response.status);
  }
}

export default PeerRelationship;
