function normalizePhoneNumber(phone: string): string {
  return phone.replace(/^(\+?)(.*)$/, (_, prefix, num) => {
    return prefix + num.replace(/\D/g, '');
  });
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export {
  normalizePhoneNumber,
  normalizeEmail
}