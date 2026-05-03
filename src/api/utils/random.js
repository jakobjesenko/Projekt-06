export const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const pickMany = (arr, count = 2) =>
  [...arr].sort(() => 0.5 - Math.random()).slice(0, count);

export const randomDate = () => {
  const start = new Date();
  const end = new Date(2026, 0, 1);
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

export const randomImage = () => `https://picsum.photos/seed/${Math.random()}/400/400`;