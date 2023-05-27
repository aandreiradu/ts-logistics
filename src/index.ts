import express, { Response } from "express";
import readline from "readline";
import { AxiosError } from "axios";
import {
  AvailableCommandsProps,
  CustomRequest,
  CustomResponse,
} from "./utils/types";
import PeerRelationship from "./peer";

const receiver = process.env.RECEIVER_PORT;
const availableCommands: AvailableCommandsProps[] = ["balance", "pay"];

if (!receiver) {
  console.log("Receiver not provided");
  process.exit(1);
}

const app = express();
app.use(express.json());

const peer = new PeerRelationship(+receiver);

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

rl.on("line", async (input) => {
  const contentSplitted = input.split(" ");
  const commandType = contentSplitted[0];
  const amount = +contentSplitted[1];

  switch (commandType) {
    case "help": {
      console.log(
        ` 
          =================
          Available commands: ${[...availableCommands]}
          =================
          `
      );
      break;
    }

    case "pay": {
      try {
        await peer.pay(amount);
        console.log(`You\'ve sent ${amount}$`);
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
      }

      break;
    }

    case "balance": {
      console.log("Your balance is ", peer._balance, "$");
      return;
    }

    case "exit": {
      console.log("Goodbye");
      process.exit(1);
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

  try {
    switch (type) {
      case "receive": {
        const { amount } = req.body.data;

        peer.receive(amount);
        console.log(`You received ${amount}$`);
        return res.status(200).send();
      }

      default: {
        throw new Error(`Unable to fullfill the request of type ${type}`);
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).send({
        message:
          error.message ?? `Unable to fullfill the request of type ${type}`,
      });
    }
  }
});

export default app;
