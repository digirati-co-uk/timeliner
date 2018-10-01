export default function invariant(fn, message) {
  if (!fn()) {
    throw new Error(message);
  }
  return true;
}
