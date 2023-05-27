import PeerRelationship from "../peer";
import AxiosMockAdapter from "axios-mock-adapter";
import axios, { AxiosError } from "axios";

describe("PEERING TESTS", () => {
  const receiver = 3000;
  let peer: PeerRelationship; //= new PeerRelationship(receiver);
  const mock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    mock.resetHistory();
    peer = new PeerRelationship(receiver);
  });

  describe("balance", () => {
    it("should return the account balance", () => {
      expect(peer.balance).toBe(0);
    });
  });

  describe("pay", () => {
    it("should throw an error if amount is negative or eq to 0", () => {
      expect(async () => peer.pay(-1)).rejects.toThrowError(
        /Amount should be a positive number/
      );
    });

    it("should throw an error if amount is NaN", () => {
      expect(async () => peer.pay(NaN)).rejects.toThrowError(
        /Amount is not a valid number/
      );
    });

    it("should update the sender balance with the amount sent", async () => {
      const amount = 30;
      mock
        .onPost(`http://localhost:${receiver}/`, {
          type: "receive",
          data: {
            amount,
          },
        })
        .reply(200);
      await peer.pay(amount);
      expect(peer.balance).toBe(-amount);
    });

    it("should update the receiver balance with the amount sent", () => {
      const amount = 10;
      peer.receive(amount);
      expect(peer.balance).toBe(amount);
    });

    it("should throw an error if the payment service fails", async () => {
      const amount = 30;
      mock
        .onPost(`http://localhost:${receiver}/`, {
          type: "receive",
          data: {
            amount,
          },
        })
        .reply(400);

      expect(async () => await peer.pay(amount)).rejects.toThrowError(
        AxiosError
      );
      expect(peer.balance).toBe(0);
    });
  });
});
