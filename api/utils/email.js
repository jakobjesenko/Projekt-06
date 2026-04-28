if (process.env.NODE_ENV !== 'production') {
  await import('dotenv/config');
}

import { Resend } from 'resend';

const createResendClient = () => new Resend(process.env.RESEND_API_KEY);
let resend = createResendClient();
const APP_URL = process.env.APP_URL || 'http://localhost:3000';
const EMAIL_FROM = process.env.EMAIL_FROM || 'onboarding@resend.dev';

export const __setResendForTests = (client) => {
  resend = client;
};

export const __resetResendForTests = () => {
  resend = createResendClient();
};

// Pošlje email
export const sendVerificationEmail = async (email, token, firstName, type = 'verification') => {
  const verificationUrl =
    type === 'reset'
      ? `${APP_URL}/reset-password?token=${token}`
      : `${APP_URL}/api/auth/verify-email?token=${token}`; // FLAG: tle spremenis v `${APP_URL}/verify-email?token=${token}` ko dodas angular

  const subject =
    type === 'reset'
      ? 'Ponastavitev gesla - Srecajmo se'
      : 'Potrdite svoj email naslov - Srecajmo se';

  const title = type === 'reset' ? 'Ponastavitev gesla' : 'Potrdite email';
  const buttonText = type === 'reset' ? '🔑 Ponastavi geslo' : '✅ Potrdite email naslov';
  const greeting =
    type === 'reset'
      ? `<p>Prejeli smo zahtevo za ponastavitev gesla za vaš račun.</p>
       <p>Za ponastavitev gesla, prosimo, kliknite na spodnji gumb:</p>`
      : `<p>Hvala, da ste se registrirali na Srecajmo se!</p>
       <p>Za dokončanje registracije in aktivacijo računa, prosimo, kliknite na spodnji gumb:</p>`;

  const warningText =
    type === 'reset'
      ? '<strong>⏰ Pomembno:</strong> Ta povezava bo veljavna 1 uro.'
      : '<strong>⏰ Pomembno:</strong> Ta povezava bo veljavna 24 ur.';

  const footerText =
    type === 'reset'
      ? 'Če niste zahtevali ponastavitve gesla, prosimo, ignorirajte to sporočilo.'
      : 'Če niste zahtevali registracije na Srecajmo se, prosimo, ignorirajte to sporočilo.';

  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html lang="sl">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${title}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f4f4f4;
            }
            .container {
              background-color: white;
              border-radius: 10px;
              padding: 30px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              padding-bottom: 20px;
              border-bottom: 2px solid #0d6efd;
            }
            .header h1 {
              color: #0d6efd;
              margin: 0;
              font-size: 28px;
            }
            .content {
              padding: 30px 0;
            }
            .button {
              display: inline-block;
              padding: 15px 30px;
              background-color: #0d6efd;
              color: white !important;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              margin: 20px 0;
              text-align: center;
            }
            .button:hover {
              background-color: #0b5ed7;
            }
            .footer {
              text-align: center;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              color: #666;
              font-size: 14px;
            }
            .warning {
              background-color: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 15px;
              margin: 20px 0;
              border-radius: 5px;
            }
            .link {
              word-break: break-all;
              color: #0d6efd;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🤝 Srecajmo se</h1>
            </div>
            
            <div class="content">
              <h2>Pozdravljeni, ${firstName}! 👋</h2>
              
              ${greeting}
              
              <center>
                <a href="${verificationUrl}" class="button">
                  ${buttonText}
                </a>
              </center>
              
              <div class="warning">
                ${warningText}
              </div>
              
              <p>Če gumb ne deluje, kopirajte in prilepite spodnjo povezavo v svoj brskalnik:</p>
              <p class="link">${verificationUrl}</p>
              
              <p style="margin-top: 30px;">
                ${footerText}
              </p>
            </div>
            
            <div class="footer">
              <p>
                &copy; 2025 Srecajmo se<br>
              </p>
              <p style="font-size: 12px; color: #999;">
                To je avtomatsko sporočilo. Prosimo, ne odgovarjajte nanj.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Pozdravljeni, ${firstName}!
        
        ${type === 'reset' ? 'Prejeli smo zahtevo za ponastavitev gesla za vaš račun.' : 'Hvala, da ste se registrirali na Srecajmo se!'}
        
        ${type === 'reset' ? 'Za ponastavitev gesla kliknite na spodnjo povezavo:' : 'Za dokončanje registracije in aktivacijo računa, prosimo, kliknite na spodnjo povezavo:'}
        
        ${verificationUrl}
        
        Pomembno: Ta povezava bo veljavna ${type === 'reset' ? '1 uro' : '24 ur'}.
        
        ${footerText}
         
        ---
        © 2025 Srecajmo se
      `,
    });

    if (error) {
      console.error('Email sending error:', error);
      return { success: false, error };
    }

    console.log('Verification email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Email sending exception:', error);
    return { success: false, error: error.message };
  }
};

// Pošlje email za ponastavitev gesla
export const sendPasswordResetEmail = async (email, token, firstName) => {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: 'Ponastavitev gesla - Srecajmo se',
      html: `
        <!DOCTYPE html>
        <html lang="sl">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Ponastavitev gesla</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f4f4f4;
            }
            .container {
              background-color: white;
              border-radius: 10px;
              padding: 30px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              padding-bottom: 20px;
              border-bottom: 2px solid #dc3545;
            }
            .header h1 {
              color: #dc3545;
              margin: 0;
              font-size: 28px;
            }
            .content {
              padding: 30px 0;
            }
            .button {
              display: inline-block;
              padding: 15px 30px;
              background-color: #dc3545;
              color: white !important;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              margin: 20px 0;
              text-align: center;
            }
            .button:hover {
              background-color: #c82333;
            }
            .footer {
              text-align: center;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              color: #666;
              font-size: 14px;
            }
            .warning {
              background-color: #f8d7da;
              border-left: 4px solid #dc3545;
              padding: 15px;
              margin: 20px 0;
              border-radius: 5px;
            }
            .link {
              word-break: break-all;
              color: #dc3545;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Srecajmo se</h1>
            </div>
            
            <div class="content">
              <h2>Pozdravljeni, ${firstName}! 👋</h2>
              
              <p>Prejeli smo zahtevo za ponastavitev gesla za vaš račun.</p>
              
              <p>Če ste to vi, kliknite na spodnji gumb za ponastavitev gesla:</p>
              
              <center>
                <a href="${resetUrl}" class="button">
                  🔄 Ponastavi geslo
                </a>
              </center>
              
              <div class="warning">
                <strong>⏰ Pomembno:</strong> Ta povezava bo veljavna 1 uro.
              </div>
              
              <p>Če gumb ne deluje, kopirajte in prilepite spodnjo povezavo v svoj brskalnik:</p>
              <p class="link">${resetUrl}</p>
              
              <p style="margin-top: 30px; color: #dc3545; font-weight: bold;">
                ⚠️ Če niste zahtevali ponastavitve gesla, prosimo, ignorirajte to sporočilo ali kontaktirajte podporo.
              </p>
            </div>
            
            <div class="footer">
              <p>
                &copy; 2025 Srecajmo se<br>
              </p>
              <p style="font-size: 12px; color: #999;">
                To je avtomatsko sporočilo. Prosimo, ne odgovarjajte nanj.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Pozdravljeni, ${firstName}!
        
        Prejeli smo zahtevo za ponastavitev gesla za vaš račun.
        
        Če ste to vi, kliknite na spodnjo povezavo za ponastavitev gesla:
        
        ${resetUrl}
        
        Pomembno: Ta povezava bo veljavna 1 uro.
        
        Če niste zahtevali ponastavitve gesla, prosimo, ignorirajte to sporočilo ali kontaktirajte podporo.
        
        ---
        © 2025 Srecajmo se
      `,
    });

    if (error) {
      console.error('Password reset email error:', error);
      return { success: false, error };
    }

    console.log('Password reset email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Password reset email exception:', error);
    return { success: false, error: error.message };
  }
};

// Pošlje obvestilo adminu o novem kontaktu
export const sendContactNotificationEmail = async (name, lastName, email, subject, message) => {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: email,
      replyTo: email,
      subject: `Vprašanje uporabnika o ${subject}`,
      html: `
        <h2>Prejeli smo vaše sporočilo. Povzetek je spodaj:</h2>
        <p><strong>Ime:</strong> ${name}</p>
        <p><strong>Priimek:</strong> ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Zadeva:</strong> ${subject}</p>
        <p><strong>Sporočilo:</strong></p>
        <p>${message}</p>
      `,
      text: `
        Novo sporočilo iz kontaktnega obrazca

        Ime: ${name}
        Priimek: ${lastName}
        Email: ${email}
        Zadeva: ${subject}
        Sporočilo:
        ${message}
      `,
    });

    if (error) {
      console.error('Contact notification email error:', error);
      return { success: false, error };
    }

    console.log('Contact notification email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Contact notification email exception:', error);
    return { success: false, error: error.message };
  }
};

// Pošlje splošen mail uporabnikom -> V kolikor se bo rablo
export const sendEmail = async (to, subject, html, text) => {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject,
      html,
      text,
    });

    if (error) {
      console.error('Email sending error:', error);
      return { success: false, error };
    }

    console.log('Email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Email sending exception:', error);
    return { success: false, error: error.message };
  }
};