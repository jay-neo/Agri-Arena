export function getRandomString(strings: string[]): string {
  if (strings.length === 0) {
    return "";
  }

  const randomIndex = Math.floor(Math.random() * strings.length);
  return strings[randomIndex];
}
