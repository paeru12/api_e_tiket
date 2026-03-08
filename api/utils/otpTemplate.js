// api/utils/otpTemplate.js
function buildOtpHtml(otp, email, ttlMinutes = 10) {
  return `
  <div style="margin:0; padding:0; background:#f6f3e9; font-family:Arial, sans-serif;">

        <table align="center" width="100%" cellpadding="0" cellspacing="0" style="padding:30px 10px;">
            <tr>
                <td>

                    <table align="center" width="600" cellpadding="0" cellspacing="0"
                        style="background:#ffffff; border:4px dashed #000; box-shadow:8px 8px 0 #000;">

                        <!-- HEADER -->
                        <tr>
                            <td
                                style="background:#3b82f6; padding:20px; text-align:center; border-bottom:4px solid #000;">

                                <div>
                                    <img src="https://biodegradable-pat-doubly.ngrok-free.dev/uploads/logo/belisenang_png.png" alt="Logo" width="170">
                                </div>

                                <div style="font-size:13px; margin-top:-5px; color: #ffffff;">
                                    Platform tiket konser, festival & event seru
                                </div>

                            </td>
                        </tr>

                        <!-- CONTENT -->
                        <tr>
                            <td style="padding:35px; text-align:center;">

                                <h2 style="margin:0; font-size:24px; color:#000;">
                                    Verifikasi Akun Kamu
                                </h2>

                                <p style="margin-top:10px; font-size:15px; color:#444;">
                                    Halo <b>${email}</b>,<br>
                                    Gunakan kode OTP berikut untuk melanjutkan proses verifikasi akun kamu.
                                </p>


                                <!-- OTP BOX -->
                                <div style="
                  margin:30px auto;
                  width:260px;
                  background:#fff;
                  border:4px dashed #000;
                  padding:18px;
                  font-size:36px;
                  font-weight:bold;
                  letter-spacing:8px;
                  color:#000;
                  background:#fffbe6;
                ">
                                    ${otp}
                                </div>


                                <p style="font-size:13px; color:#555;">
                                    Kode ini berlaku selama <b>${ttlMinutes} menit</b>.
                                </p>

                                <p style="font-size:13px; color:#888;">
                                    Demi keamanan akun kamu, jangan bagikan kode ini kepada siapa pun.
                                </p>

                            </td>
                        </tr>


                        <!-- CTA -->
                        <tr>
                            <td style="padding:0 35px 30px 35px; text-align:center;">

                                <a href="https://belisenang.com" style="
                display:inline-block;
                background:#ff3b30;
                color:white;
                text-decoration:none;
                padding:14px 24px;
                font-weight:bold;
                border:3px solid #000;
                box-shadow:4px 4px 0 #000;
                font-size:14px;
                ">
                                    Jelajahi Event Seru →
                                </a>

                            </td>
                        </tr>


                        <!-- FOOTER -->
                        <tr>
                            <td style="background:#000; color:#fff; padding:25px; text-align:center;">

                                <div style="font-size:13px; margin-bottom:10px;">
                                    Butuh bantuan?
                                </div>

                                <div style="font-size:13px;">

                                    <a href="mailto:cs@belisenang.com" style="color:#FFD400; text-decoration:none;">
                                        cs@belisenang.com
                                    </a>

                                    &nbsp;&nbsp;|&nbsp;&nbsp;

                                    <a href="https://wa.me/6281232662607" style="color:#FFD400; text-decoration:none;">
                                        WhatsApp Support
                                    </a>

                                </div>

                                <div style="margin-top:15px; font-size:11px; color:#bbb;">
                                    © 2026 BELISENANG — Semua Hak Dilindungi
                                </div>

                            </td>
                        </tr>

                    </table>

                </td>
            </tr>
        </table>

    </div>
`;
}


module.exports = { buildOtpHtml };
