import express, { Response } from "express";
import readline from "readline";
import axios, { AxiosError } from "axios";
import {
  AvailableCommandsProps,
  CustomRequest,
  CustomResponse,
} from "./utils/types";
import { isAmountValid } from "./utils/guards";
import createServer from "./tests/mockServer";

const receiver = process.env.RECEIVER_PORT;
const availableCommands: AvailableCommandsProps[] = ["balance", "pay"];

const app = express();
app.use(express.json());

app.listen(process.env.PORT, () => {
  console.log("peering started on port:", process.env.PORT);

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

let balance: number = 0;

rl.on("line", async (input) => {
  const contentSplitted = input.split(" ");
  const commandType = contentSplitted[0];
  const amount = +contentSplitted[1];

  switch (commandType) {
    case "pay": {
      const amountValidity = isAmountValid(amount);

      if (!amountValidity) {
        console.log("Invalid amount.");
        return;
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

        console.log("responseReceiver", responseReceiver.data);

        // if (responseReceiver.status === 200) {
        const { message } = responseReceiver?.data || null;

        if (!message) {
          console.log("No message received from BE");
          throw new Error("Someting went wrong :(. Try again later");
        }

        console.log(`Your ${amount}$ payment was approved`);
        balance -= amount;
        return;

        // switch (message) {
        //   case "approved": {
        //     console.log(`Your ${amount}$ payment was approved`);
        //     balance -= amount;
        //     return;
        //   }

        //   default: {
        //     console.log("default reached. Unhandled message", message);
        //     throw new Error("Someting went wrong. Please try again");
        //   }
        // }
        // }

        // throw new Error("Another status received from BE");
      } catch (error) {
        if (error instanceof AxiosError) {
          console.log(error.response?.data.message);
          return;
        }

        if (error instanceof Error) {
          console.log(error.message);
          return;
        }

        console.log("Something went wrong :(");
        return;
      }
    }

    case "balance": {
      // try {
      //   const response = await axios({
      //     method: "POST",
      //     url: `http://localhost:${process.env.PORT}/`,
      //     data: {
      //       type: commandType,
      //     },
      //   });

      //   if (response.status === 200 && response.data) {
      //     console.log("Your balance is ", response.data?.data.balance, "$");
      //   }
      // } catch (error) {
      //   console.log("Hmm, something went wrong. Please try again later");
      //   return;
      // }
      // break;

      console.log("Your balance is ", balance, "$");
      return;
    }

    default: {
      console.log(
        ` 
        =================
        I dont know this command. 
        Available commands: ${[...availableCommands]}
        =================
        `
      );
      break;
    }
  }
});

app.post("/", (req: CustomRequest, res: Response<CustomResponse>, next) => {
  const { type } = req.body;

  switch (type) {
    case "receive": {
      const { amount } = req.body.data;
      const amountValidity = isAmountValid(amount);

      if (!amountValidity) {
        return res.status(400).send({
          message: "Invalid amount",
        });
      }

      balance += amount;
      console.log("You received", amount, "$");
      // return res.status(200).send({
      //   message: "approved",
      //   data: {
      //     balance,
      //   },
      // });

      return res.status(200).send({
        message: "approved",
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
      // break;
    }
  }
});

export default app;
