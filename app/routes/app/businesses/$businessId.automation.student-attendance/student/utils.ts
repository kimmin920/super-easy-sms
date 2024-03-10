export function checkLastFourDigits(phoneNumber: string, digits: string) {
  const numberLastFour = phoneNumber.substring(phoneNumber.length - 4);
  return numberLastFour === digits;
}
