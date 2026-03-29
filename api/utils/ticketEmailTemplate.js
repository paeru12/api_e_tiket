function buildTicketEmail({ name, eventName, eventDate, eventLocation }) {

return `
<!DOCTYPE html>
<html> 

<head>
    <meta charset="UTF-8">
</head>

<body style="margin:0;padding:0;font-family:Arial,sans-serif;">

    <div style="margin:0;padding:0;">

        <table align="center" width="100%" cellpadding="0" cellspacing="0" style="padding:30px 10px;">

            <tr>
                <td>

                    <table align="center" width="600" cellpadding="0" cellspacing="0"
                        style="background:#ffffff;border:4px dashed #000;box-shadow:8px 8px 0 #000;">

                        <!-- HEADER -->
                        <tr>
                            <td style="background:#3b82f6;padding:20px;text-align:center;border-bottom:4px solid #000;">

                                <img src="https://biodegradable-pat-doubly.ngrok-free.dev/uploads/logo/belisenang_png.png"
                                    width="170">

                                <div style="font-size:13px;margin-top:-5px;color:#ffffff;">
                                    Platform tiket konser, festival & event seru
                                </div>

                            </td>
                        </tr>


                        <!-- CONTENT -->
                        <tr>
                            <td style="padding:35px;text-align:center;">

                                <h2 style="margin:0;font-size:24px;color:#000;">
                                    Tiket Kamu Sudah Siap 🎫
                                </h2>

                                <p style="margin-top:10px;font-size:15px;color:#444;">
                                    Halo <b>${name}</b>,<br>
                                    Terima kasih sudah membeli tiket di <b>Belisenang</b>.
                                </p>

                                <p style="font-size:14px;color:#555;">
                                    Tiket untuk event berikut sudah tersedia dan terlampir pada email ini.
                                </p>


                                <!-- EVENT CARD -->
                                <table align="center" width="100%" cellpadding="10" cellspacing="0"
                                    style="margin-top:20px;border:3px solid #000;background:#fffbe6;">

                                    <tr>
                                        <td style="text-align:left;font-size:14px;">

                                            <b>EVENT</b><br>
                                            ${eventName}

                                            <br><br>

                                            <b>TANGGAL</b><br>
                                            ${eventDate}

                                            <br><br>

                                            <b>LOKASI</b><br>
                                            ${eventLocation}

                                        </td>
                                    </tr>

                                </table>



                                <!-- ATTACHMENT INFO -->
                                <div style="
margin-top:25px;
background:#f1f5f9;
padding:15px;
border:2px dashed #000;
font-size:14px;
">

                                    📎 Tiket kamu tersedia sebagai <b>lampiran PDF</b> di email ini.<br>
                                    Silakan unduh dan tunjukkan saat memasuki event.

                                </div>



                            </td>
                        </tr>


                        <!-- CTA -->
                        <tr>
                            <td style="padding:0 35px 30px 35px;text-align:center;">

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

                                    Lihat Event Lain →

                                </a>

                            </td>
                        </tr>


                        <!-- FOOTER -->
                        <tr>
                            <td style="background:#000;color:#fff;padding:25px;text-align:center;">

                                <div style="font-size:13px;margin-bottom:10px;">
                                    Butuh bantuan?
                                </div>

                                <div style="font-size:13px;">

                                    <a href="mailto:cs@belisenang.com" style="color:#FFD400;text-decoration:none;">
                                        cs@belisenang.com
                                    </a>

                                    &nbsp;&nbsp;|&nbsp;&nbsp;

                                    <a href="https://wa.me/6281232662607" style="color:#FFD400;text-decoration:none;">
                                        WhatsApp Support
                                    </a>

                                </div>

                                <div style="margin-top:15px;font-size:11px;color:#bbb;">
                                    © 2026 BELISENANG — Semua Hak Dilindungi
                                </div>

                            </td>
                        </tr>

                    </table>

                </td>
            </tr>

        </table>

    </div>

</body>

</html>
`;
}

module.exports = buildTicketEmail;