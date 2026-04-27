import { Resend } from "resend";

type SendMagicLinkEmailInput = {
  email: string;
  link: string;
  subject?: string;
};

export async function sendMagicLinkEmail({
  email,
  link,
  subject,
}: SendMagicLinkEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY");
  }

  const resend = new Resend(apiKey);

  const from =
    process.env.EMAIL_FROM && process.env.EMAIL_FROM.trim()
      ? process.env.EMAIL_FROM.trim()
      : "Workzy <hello@workzy.hu>";

  console.log("======================================");
  console.log("EMAIL KÜLDÉS INDUL");
  console.log("TO:", email);
  console.log("FROM:", from);
  console.log("LINK:", link);
  console.log("======================================");

  const result = await resend.emails.send({
    from,
    to: email,
    subject: subject || "Véglegesítsd az álláshirdetésed a Workzy-ban",
    html: `
      <div style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 16px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:24px;border:1px solid #e5e7eb;padding:32px;">
                <tr>
                  <td>
                    <h1 style="margin:0 0 14px;color:#0f172a;font-size:28px;line-height:1.2;font-weight:800;">
                      Véglegesítsd az álláshirdetésed
                    </h1>

                    <p style="margin:0;color:#475569;font-size:16px;line-height:1.6;">
                      Kattints az alábbi gombra, és belépsz a Workzy felületére, ahol véglegesítheted és kezelheted a hirdetésed.
                    </p>

                    <div style="margin-top:28px;">
                      <a href="${link}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:14px 22px;border-radius:14px;font-weight:700;font-size:15px;">
                        Belépés és véglegesítés
                      </a>
                    </div>

                    <p style="margin:28px 0 0;color:#64748b;font-size:13px;line-height:1.5;">
                      A link 15 percig érvényes. Ha nem te kérted ezt az emailt, hagyd figyelmen kívül.
                    </p>

                    <p style="margin:24px 0 0;color:#94a3b8;font-size:12px;">
                      Workzy
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    `,
  });

  console.log("======================================");
  console.log("EMAIL KÜLDÉS EREDMÉNY:");
  console.log(JSON.stringify(result, null, 2));
  console.log("======================================");

  return result;
}