/**
 * Input sanitization — XSS, SQL injection, script tag prevention
 */

export function sanitizeHTML(input: string): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed\b[^>]*>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .replace(/data:text\/html/gi, "");
}

export function sanitizeInput(input: string): string {
  if (typeof input !== "string") return "";
  return input
    .trim()
    .replace(/[<>]/g, "")
    .replace(/['";`]/g, "")
    .replace(/\\/g, "")
    .replace(/\$\{/g, "")
    .slice(0, 5000);
}

export function escapeHTML(input: string): string {
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return regex.test(email) && email.length < 255;
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-]{1,200}$/.test(slug);
}

export function isValidUsername(username: string): boolean {
  return /^[a-zA-Z0-9_-]{3,30}$/.test(username);
}

export function isStrongPassword(password: string): { valid: boolean; reason?: string } {
  if (password.length < 10) return { valid: false, reason: "Minimum 10 characters" };
  if (!/[A-Z]/.test(password)) return { valid: false, reason: "Needs uppercase letter" };
  if (!/[a-z]/.test(password)) return { valid: false, reason: "Needs lowercase letter" };
  if (!/[0-9]/.test(password)) return { valid: false, reason: "Needs a number" };
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return { valid: false, reason: "Needs special character" };
  return { valid: true };
}