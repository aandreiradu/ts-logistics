export const isAmountValid = (amount: number): void => {
  if (isNaN(amount) || typeof amount !== "number") {
    throw new Error("Amount is not a valid number");
  }

  if (amount <= 0) {
    // console.log("gotcha 😤, please input only positive numbers");
    throw new Error("Amount should be a positive number");
  }
};
