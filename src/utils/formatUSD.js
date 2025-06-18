// src/utils/formatUSD.js
export const formatUSD = (value) =>
  "$" + Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
