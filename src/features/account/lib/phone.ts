const PHONE_DIGITS_LENGTH = 10;
// Any 10-digit number is accepted — no longer restricted to the French local format
// (leading `0` + non-zero second digit), per direct user request to drop that restriction.
const PHONE_PATTERN = /^\d{10}$/;

export function formatPhoneInput(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, PHONE_DIGITS_LENGTH);
  return digits.match(/.{1,2}/g)?.join(' ') ?? digits;
}

export function isValidFrenchPhone(value: string) {
  const digits = value.replace(/\s/g, '');
  return PHONE_PATTERN.test(digits);
}

export function toE164FrenchPhone(value: string) {
  const digits = value.replace(/\s/g, '');
  // Numbers still entered in the French local format (leading 0) drop that 0 for the +33
  // country code, as before. A number with no leading 0 (now allowed since the 06-style
  // restriction was removed) is passed through as-is rather than truncated.
  const local = digits.startsWith('0') ? digits.slice(1) : digits;
  return `+33${local}`;
}
