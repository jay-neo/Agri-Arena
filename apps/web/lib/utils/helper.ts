export function extractUrls(text: string): string[] {
  const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|(ftp:\/\/[^\s]+)/g;
  const matches = text.match(urlRegex);
  return matches || [];
}

export function getRandomString(strings: string[]): string {
  if (strings.length === 0) {
    return "";
  }
  const randomIndex = Math.floor(Math.random() * strings.length);
  return strings[randomIndex];
}
