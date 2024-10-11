export function extractUrls(text: string): string[] {
  const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|(ftp:\/\/[^\s]+)/g;
  const matches = text.match(urlRegex);
  return matches || [];
}
