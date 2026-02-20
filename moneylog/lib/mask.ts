const ACCOUNT_PATTERN = /\b\d{2,6}[- ]\d{2,6}[- ]\d{2,6}\b/g;
const LONG_NUMBER_PATTERN = /\b\d{6,}\b/g;

function maskTail(value: string, visible = 2): string {
  const clean = value.replace(/[- ]/g, "");
  if (clean.length <= visible) {
    return "*".repeat(clean.length);
  }
  const hidden = "*".repeat(clean.length - visible);
  const tail = clean.slice(-visible);
  return `${hidden}${tail}`;
}

export function maskSensitiveText(note: string): string {
  if (!note) {
    return note;
  }

  const maskedAccount = note.replace(ACCOUNT_PATTERN, (match) => {
    const masked = maskTail(match, 2);
    if (match.includes("-")) {
      return masked.replace(/(.{3})(?=.)/g, "$1-").replace(/-$/, "");
    }
    return masked;
  });

  return maskedAccount.replace(LONG_NUMBER_PATTERN, (match) => maskTail(match, 2));
}
