export function isValidEmail(email: string): boolean {
  return /^\S+@\S+\.\S+$/.test(email);
}

export function isValidPassword(password: string): boolean {
  return typeof password === 'string' && password.length >= 8;
}