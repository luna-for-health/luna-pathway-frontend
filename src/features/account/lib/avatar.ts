const AVATAR_MIN = 10;
const AVATAR_MAX = 18;

export function getRandomAvatar() {
  return Math.floor(Math.random() * (AVATAR_MAX - AVATAR_MIN + 1)) + AVATAR_MIN;
}
