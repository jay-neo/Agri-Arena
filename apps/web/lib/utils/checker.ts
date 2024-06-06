export function isNumber(value: string): boolean {
  const number = Number(value);
  return !isNaN(number) && isFinite(number);
}

export function isMobile(): boolean {
  return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}





