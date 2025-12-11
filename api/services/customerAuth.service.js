const client = require("../utils/redis");
const { CustomerUser } = require("../../models");
const sendEmail = require("../utils/sendEmail");

module.exports = {
  // 1. REQUEST OTP LOGIN
  async requestOtp(email) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Simpan ke Redis dengan expired 5 menit (300 detik)
    await client.setEx(`otp:${email}`, 300, otp);

    // Kirim via email
    await sendEmail(
      email,
      "Kode OTP Login Anda",
      `<p>Kode OTP Anda adalah: <b>${otp}</b></p>`
    );

    return { message: "OTP dikirim ke email" };
  },

  // 2. VERIFIKASI OTP
  async verifyOtp(email, otp) {
    const savedOtp = await client.get(`otp:${email}`);

    if (!savedOtp) {
      throw new Error("OTP kadaluarsa atau belum dibuat");
    }

    if (savedOtp !== otp) {
      throw new Error("OTP salah");
    }

    // Hapus OTP dari redis setelah dipakai
    await client.del(`otp:${email}`);

    // Cek customer sudah ada?
    let customer = await CustomerUser.findOne({ where: { email } });

    // Jika belum ada → buat customer baru minimal
    if (!customer) {
      customer = await CustomerUser.create({
        email,
        full_name: null,
        phone: null,
        photo_url: null,
      });
    }

    return {
      message: "OTP valid",
      data: customer,
    };
  }
};
