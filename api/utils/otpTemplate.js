// api/utils/otpTemplate.js
function buildOtpHtml(otp, email, ttlMinutes = 10) {
  return `
  <div style="margin:0; padding:0; background:#f5f7fa; font-family:Arial, sans-serif;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
      <tr>
        <td>
          <table align="center" width="600" cellpadding="0" cellspacing="0"
            style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.08);">

            <tr>
              <td style="background:#ffffff; padding:15px; text-align:center; border-bottom: 5px solid #1d39c4;">
                <img src="https://i.ibb.co/4P9XV0C/logo.png" alt="Logo" width="80">
              </td>
            </tr>

            <tr>
              <td style="padding:30px;">
                <h2 style="color:#333333; text-align:center; margin:0; font-size:22px; font-weight:600;">
                  OTP Verification
                </h2>

                <p style="text-align:center; color:#555555; margin-top:10px; font-size:15px; line-height:22px;">
                  Hai, <b>${email}</b><br>
                  Silakan masukkan kode OTP berikut untuk verifikasi akun Anda.
                </p>

                <div style="
                text-align:center;
                margin:25px 0;
                padding:20px;
                background:#eef3ff;
                border-radius:10px;
                font-size:36px;
                font-weight:bold;
                letter-spacing:7px;
                color:#1d39c4;">
                  ${otp}
                </div>

                <p style="text-align:center; color:#777; font-size:13px; margin-top:10px; line-height:20px;">
                  Kode OTP ini berlaku selama <b>${ttlMinutes} menit</b>.<br>
                  Jangan pernah membagikan kode kepada siapa pun demi keamanan akun Anda.
                </p>
              </td>
            </tr>

            <tr>
              <td style="background:#1d39c4; padding:30px; text-align:center; color:#ffffff;">
                <div style=" font-size:13px; line-height:10px;">

                  <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
                      <a href="mailto:cs@nontonkonser.com" target="_blank" style="color:white; text-decoration:none; display: flex; align-items: center;">
                        <img
                          src="https://png.pngtree.com/png-clipart/20191120/original/pngtree-email-icon-png-image_5065641.jpg"
                          width="22" style="margin: 0 5px;">
                        cs@nontonkonser.com</a>
                      <a href="https://wa.me/6281232662607?text=Halo Nontonkonser" target="_blank" style="margin:0 8px; color:white; text-decoration:none; display: flex; align-items: center;">
                        <img
                          src="https://img.freepik.com/premium-psd/whatsapp-icon-isolated-white-background-phone-bubble-chat-icon-social-media-app-button-logo_989822-4699.jpg?semt=ais_se_enriched&w=740&q=80"
                          width="22" style="margin: 0 5px;">
                        +62 821-0000-0000
                      </a>
                  </div>
                </div>

                <p
                  style="margin-top:15px; padding-top: 10px; font-size:12px; color:#d9d9d9; border-top: 2px solid #ffffff;">
                  © 2025 Nontonkonser Hak Cipta Dilindungi.
                </p>
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
