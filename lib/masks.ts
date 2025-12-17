export function onlyDigits(s: string) {
  return s.replace(/\D/g, "");
}

export function formatPhone(digits10: string) {
  const d = onlyDigits(digits10).slice(0, 10);
  const p1 = d.slice(0, 3);
  const p2 = d.slice(3, 6);
  const p3 = d.slice(6, 8);
  const p4 = d.slice(8, 10);

  let out = "+7";
  if (d.length > 0) out += " " + p1;
  if (d.length > 3) out += " " + p2;
  if (d.length > 6) out += " " + p3;
  if (d.length > 8) out += " " + p4;
  return out;
}

export function isPhoneComplete(digits10: string) {
  return onlyDigits(digits10).length === 10;
}

export function maskPhoneDisplay(digits10: string) {
  const d = onlyDigits(digits10).slice(0, 10);
  const last2 = d.slice(-2).padStart(2, "0");
  return `+7 ********${last2}`;
}

export function formatCard(digits16: string) {
  const d = onlyDigits(digits16).slice(0, 16);
  const g1 = d.slice(0, 4);
  const g2 = d.slice(4, 8);
  const g3 = d.slice(8, 12);
  const g4 = d.slice(12, 16);

  return [g1, g2, g3, g4].filter(Boolean).join(" ");
}

export function isCardComplete(digits16: string) {
  return onlyDigits(digits16).length === 16;
}

export function maskCardDisplay(digits16: string) {
  const d = onlyDigits(digits16).slice(0, 16);
  const last4 = d.slice(-4).padStart(4, "0");
  return `**** **** **** ${last4}`;
}
