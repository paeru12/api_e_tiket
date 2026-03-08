// utils/wib.js
function toWIB(date) {
  if (!date) return null;

  // DB sudah WIB → tinggal format saja, tanpa tambah jam!
  const d = new Date(date);

  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  const sec = String(d.getSeconds()).padStart(2, "0");

  return `${y}-${m}-${day} ${h}:${min}:${sec}`;
}

module.exports = { toWIB };