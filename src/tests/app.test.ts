import request from "supertest";
import createServer from "./mockServer";

describe("Peering test", () => {
  const BOB_STARTS = 3000;
  const BOB_SENDS = 3001;
  const ALICE_STARTS = 3001;
  const ALICE_SENDS = 3000;

  const _bobServer = createServer();
  _bobServer.listen(BOB_STARTS, () => {
    console.log(`BOB instance is up and listening on port ${BOB_STARTS}`);
  });

  const _aliceServer = createServer();
  _aliceServer.listen(ALICE_STARTS, () => {
    console.log(`Alice instance is up and listening on port ${BOB_STARTS}`);
  });

  it("should return Bob's balance", async () => {
    const response = await request(_bobServer).post("/").send({
      type: "balance",
    });
    expect(response.status).toEqual(200);
    expect(response.body.data.balance).toEqual(0);
  });

  it("should return Alice's balance", async () => {
    const response = await request(_aliceServer).post("/").send({
      type: "balance",
    });
    expect(response.status).toEqual(200);
    expect(response.body.data.balance).toEqual(0);
  });

  it("send 10$ to Alice", async () => {
    const response = await request(_aliceServer)
      .post("/")
      .send({
        type: "receive",
        data: {
          amount: 10,
        },
      });
    expect(response.status).toEqual(200);
    expect(response.body.message).toBe("approved");
    expect(response.body.data.balance).toEqual(10);
  });

  it("should return Alice's new balance after she received a payment", async () => {
    const response = await request(_aliceServer).post("/").send({
      type: "balance",
    });
    expect(response.status).toEqual(200);
    expect(response.body.data.balance).toEqual(10);
  });

  it("should return Invalid amount if type is invalid", async () => {
    const response = await request(_bobServer).post("/").send({
      type: "invalid dto",
    });
    expect(response.status).toEqual(400);
    expect(response.body.message).toBe("Invalid command");
  });

  it("should return Invalid amount if amount is not number", async () => {
    const response = await request(_bobServer)
      .post("/")
      .send({
        type: "receive",
        data: {
          amount: "-5",
        },
      });
    expect(response.status).toEqual(200);
    expect(response.body.message).toBe("Invalid amount");
  });
});
