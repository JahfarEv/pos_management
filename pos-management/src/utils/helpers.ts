export const formatCurrency = (amount: number): string => {
  return amount.toFixed(3);
};

export const getCurrentDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const generateInvoiceNumber = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};