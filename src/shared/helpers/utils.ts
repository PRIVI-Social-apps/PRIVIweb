export const countDecimals = (value: number) => {
  if (Math.floor(value) === value) return 0;
  return value.toString().split(".")[1].length || 0;
};

export const limitOfDecimals = (number: number) => {
  if (countDecimals(number) > 5) return number.toFixed(2);
  return number;
};

export const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

export const toDecimalFormat = (currency, decimalPlace = 8) =>
  Intl.NumberFormat("en-US", { style: "decimal", maximumFractionDigits: decimalPlace }).format(currency);

export const parsePrice = (price: string): string => {
  let priceList = price.split(" ");

  if (priceList.length === 1) {
    return `${parseFloat(priceList[0])}`;
  } else if (priceList.length > 1) {
    if (isNaN(parseFloat(priceList[0]))) {
      return `${priceList[0]} ${parseFloat(priceList[1])}`;
    } else {
      return `${parseFloat(priceList[0])} ${priceList[1]}`;
    }
  }

  return price;
};

export function getUnixEpochTimeStamp(value) {
  return Math.floor(value.getTime() / 1000);
}
