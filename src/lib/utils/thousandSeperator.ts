export const formatCurrency = (input: string): string => {
  const numberPart = input.match(/\d+/)?.[0];
  if (!numberPart) return input;

  const formattedNumber = Number(numberPart).toLocaleString();

  return input.replace(/\d+/, formattedNumber);
};
