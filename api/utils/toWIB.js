// utils/toWIB.js

function toWIB(dateInput) {
  if (!dateInput) return null;

  const d = new Date(dateInput);
  return new Date(d.getTime() + 7 * 60 * 60 * 1000);
}

module.exports = { toWIB };