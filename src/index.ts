import express, { Request } from "express";
import readline from "readline";
const receiver = process.env.RECEIVER_PORT;
const app = express();
import axios from "axios";
import { isAmountValid } from "./utils/guards";

interface CustomRequest extends Request {
  body: {
    type: "pay" | "balance" | "receive";
    message?: string;
    data: {
      amount: number;
    };
  };
}

app.listen(process.env.PORT, () => {
  console.log("server listening on port 3k", process.env.PORT);

  switch (process.env.PORT) {
    case "3000": {
      console.log("Welcome, Bob!");
      break;
    }

    case "3001": {
      console.log("Welcome, Alice!");
      break;
    }
  }
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

app.use(express.json());

rl.on("line", async (input) => {
  const contentSplitted = input.split(" ");
  const commandType = contentSplitted[0];
  const amount = contentSplitted[1];

  switch (commandType) {
    case "pay": {
      try {
        const response = await axios({
          method: "POST",
          url: `http://localhost:${process.env.PORT}`,
          data: {
            type: "pay",
            data: {
              amount: Number(amount),
            },
          },
        });

        console.log("response from /pay endpoint", response.data);
        console.log(response.data.message);

        if (
          response.status === 200 &&
          response.data &&
          response.data.message === "approved"
        ) {
          console.log(`Your ${amount}$ payment was approved`);

          const receiverResponse = await axios({
            method: "POST",
            url: `http://localhost:${receiver}`,
            data: {
              type: "receive",
              data: {
                amount: Number(amount),
              },
            },
          });

          return;
        }

        break;
      } catch (error) {
        console.log("eroare", error);
        if (error instanceof Error) {
          console.log(error.message);
          return;
        }

        console.log("Something went wrong :(");
        return;
      }
    }

    case "receive": {
      console.log("receive switch");

      break;
    }

    case "balance": {
      const response = await axios({
        method: "POST",
        url: `http://localhost:${process.env.PORT}/`,
        data: {
          type: commandType,
        },
      });

      if (response.status === 200 && response.data) {
        console.log("Your balance is ", response.data.balance, "$");
      }
      break;
    }

    default: {
      console.log(`I dont know this command.`);
      break;
    }
  }
});

let balance: number = 0;

app.post("/", (req: CustomRequest, res, next) => {
  const { type } = req.body;

  switch (type) {
    case "pay": {
      const { amount } = req.body.data;
      const amountValidity = isAmountValid(amount);

      if (!amountValidity) {
        console.log("your amount was not valid");
        return res.status(200).send({
          message: "Invalid amount",
        });
      }

      console.log("your amount was valid");
      console.log("balance", balance);
      balance -= amount;

      console.log("new balance is", balance);

      return res.status(200).send({
        message: "approved",
      });
    }

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
      });
    }

    case "balance": {
      return res.status(200).send({
        balance,
      });
    }

    default: {
      console.log("I dont know this...");
      break;
    }
  }
});
