module.exports = function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")   // hapus karakter aneh
    .replace(/\s+/g, "-")       // spasi → dash
    .replace(/--+/g, "-");      // double dash
};
