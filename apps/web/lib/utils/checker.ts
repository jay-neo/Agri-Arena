export function isNumber(value: string): boolean {
  const number = Number(value);
  return !isNaN(number) && isFinite(number);
}

export function isMobile(): boolean {
  const isMobile =
    /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );

  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  return isMobile || isTouchDevice;
}
