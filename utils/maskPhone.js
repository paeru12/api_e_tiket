module.exports = {
    maskPhone(phone) {
        if (!phone) return "-";

        // contoh 081234567890 → 0812****7890
        const clean = phone.toString().replace(/\D/g, "");
        if (clean.length < 6) return phone; // terlalu pendek, biarkan apa adanya

        const start = clean.slice(0, 4);
        const end = clean.slice(-4);
        const masked = "*".repeat(clean.length - 8);

        return `${start}${masked}${end}`;
    }
};