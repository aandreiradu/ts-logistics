import express, { Response } from "express";
import { CustomRequest, CustomResponse } from "../utils/types";
import { isAmountValid } from "../utils/guards";

const createServer = () => {
  const app = express();

  app.use(express.json());

  let balance: number = 0;

  app.post("/", (req: CustomRequest, res: Response<CustomResponse>, next) => {
    const { type } = req.body;

    switch (type) {
      case "receive": {
        const { amount } = req.body.data;
        const amountValidity = isAmountValid(amount);

        if (!amountValidity) {
          return res.status(200).send({
            message: "Invalid amount",
          });
        }

        balance += amount;
        console.log("You received", amount, "$");
        return res.status(200).send({
          message: "approved",
          data: {
            balance,
          },
        });
      }

      case "balance": {
        return res.status(200).send({
          data: {
            balance,
          },
        });
      }

      default: {
        console.log("I dont know this...");
        return res.status(400).send({
          message: "Invalid command",
        });
      }
    }
  });

  // return {
  //   app: app,
  //   balance,
  // };
  return app;
};

export default createServer;
