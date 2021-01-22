export function getLikes(likes, liked) {
  const delta = liked ? 1 : -1;
  return likes + delta;
}
