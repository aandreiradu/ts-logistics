// import { isAmountValid } from "../utils/guards";
// import { CustomRequest, CustomResponse } from "../utils/types";
// import { Response, Router } from "express";

// const router = Router();

// router.post("/", (req: CustomRequest, res: Response<CustomResponse>, next) => {
//   const { type } = req.body;

//   switch (type) {
//     case "receive": {
//       const { amount } = req.body.data;
//       const amountValidity = isAmountValid(amount);

//       if (!amountValidity) {
//         return res.status(200).send({
//           message: "Invalid amount",
//         });
//       }

//       balance += amount;
//       console.log("You received", amount, "$");
//       return res.status(200).send({
//         message: "approved",
//       });
//     }

//     case "balance": {
//       return res.status(200).send({
//         data: {
//           balance,
//         },
//       });
//     }

//     default: {
//       console.log("I dont know this...");
//       break;
//     }
//   }
// });

// export default router;
