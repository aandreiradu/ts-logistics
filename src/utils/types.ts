import { Request } from "express";

export interface CustomRequest extends Request {
  body: {
    type: "pay" | "balance" | "receive" | "request";
    message?: string;
    data: {
      amount: number;
    };
  };
}

export interface CustomResponse<T = any> {
  message?: string;
  data?: T;
  error?: {
    message: string;
    fieldErrors?: {
      [key: string]: string[];
    };
  };
}

export type AvailableCommandsProps = "pay" | "balance" | "request";

export type PaymentServiceDTO = {
  balance: number;
  amount: number;
  receiver: string;
};

export type MockPaymentServiceReturn = {};
