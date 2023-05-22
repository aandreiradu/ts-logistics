export const isAmountValid = (amount: number): boolean => {
  if (isNaN(amount) || typeof amount !== "number") {
    console.log("Validation failed");
    return false;
  }

  if (amount <= 0) {
    console.log("gotcha 😤, please input only positive numbers");
    return false;
  }

  return true;
};
