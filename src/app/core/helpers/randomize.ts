export const randomizedNumId = function (): number {
  return Math.floor(Math.random() * 1000000);
}

export const randomizedStrId = function (): string {
  return Math.random().toString(36).substring(2, 14);
}
