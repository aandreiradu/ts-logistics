import { Request, Response } from "express";

export interface CustomRequest extends Request {
  body: {
    type: "pay" | "balance" | "receive";
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

export type AvailableCommandsProps = "pay" | "balance";
