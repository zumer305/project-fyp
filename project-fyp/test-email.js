/**
 * Quick Email Test Script
 * Tests if email configuration is working
 */

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const nodemailer = require("nodemailer");

async function testEmail() {
  console.log("📧 Testing Email Configuration\n");

  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_PASSWORD;
  const adminEmail = process.env.ADMIN_EMAIL;

  console.log("Configuration:");
  console.log("  FROM:", emailUser);
  console.log("  TO (Admin):", adminEmail);
  console.log("  Password:", emailPassword ? "✅ Set" : "❌ Not Set");
  console.log();

  if (!emailUser || !emailPassword) {
    console.error("❌ ERROR: Email credentials not configured in .env file");
    console.log("\nPlease set:");
    console.log("  EMAIL_USER=ai.based.destination.explorer@gmail.com");
    console.log("  EMAIL_PASSWORD=your-16-character-app-password");
    return;
  }

  try {
    console.log("📤 Creating email transporter...");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    });

    console.log("✅ Transporter created");
    console.log("\n📨 Sending test email...");

    const info = await transporter.sendMail({
      from: emailUser,
      to: adminEmail || emailUser,
      subject: "✅ Test Email - Travel Booking System",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #28a745; color: white; padding: 20px; text-align: center; border-radius: 10px; }
            .content { background: #f9f9f9; padding: 30px; margin-top: 20px; border-radius: 10px; }
            .success { background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .info-box { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #007bff; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Email System Working!</h1>
            </div>
            <div class="content">
              <div class="success">
                <strong>Success!</strong> Your email configuration is working correctly.
              </div>
              
              <h3>📋 Test Details</h3>
              <div class="info-box">
                <p><strong>From:</strong> ${emailUser}</p>
                <p><strong>To:</strong> ${adminEmail || emailUser}</p>
                <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>Service:</strong> Gmail</p>
              </div>

              <h3>✅ What This Means</h3>
              <ul>
                <li>Email credentials are correct</li>
                <li>Gmail App Password is working</li>
                <li>Booking notification emails will be sent</li>
                <li>User confirmation emails will work</li>
              </ul>

              <h3>📧 Emails You'll Receive</h3>
              <p>When a user creates a booking, you'll receive:</p>
              <ul>
                <li>📌 Booking reference number</li>
                <li>👤 Customer contact information</li>
                <li>🏖️ Package and travel details</li>
                <li>💰 Pricing information</li>
                <li>📋 Special requests from customer</li>
              </ul>

              <div class="success">
                <strong>Your booking system is ready to use! 🎉</strong>
              </div>

              <p style="margin-top: 30px; color: #666; font-size: 14px;">
                This is an automated test email from your Travel Booking System.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("✅ EMAIL SENT SUCCESSFULLY!");
    console.log("\nDetails:");
    console.log("  Message ID:", info.messageId);
    console.log("  Accepted:", info.accepted);
    console.log("  Response:", info.response);
    console.log("\n💡 Check your inbox:", adminEmail || emailUser);
    console.log("\n🎉 Email system is working correctly!");
  } catch (error) {
    console.error("\n❌ EMAIL FAILED!");
    console.error("\nError:", error.message);

    if (error.code === "EAUTH") {
      console.log("\n🔐 Authentication Error - Solutions:");
      console.log(
        "  1. Make sure you're using Gmail App Password (not regular password)"
      );
      console.log("  2. Generate App Password:");
      console.log("     • Go to: https://myaccount.google.com/apppasswords");
      console.log("     • Enable 2-Factor Authentication first");
      console.log("     • Create app password for 'Mail'");
      console.log("     • Copy the 16-character password");
      console.log("  3. Update .env file:");
      console.log("     EMAIL_PASSWORD=your-16-char-password (no spaces)");
    } else if (error.code === "ESOCKET") {
      console.log("\n🌐 Connection Error:");
      console.log("  • Check your internet connection");
      console.log("  • Verify firewall settings");
    } else {
      console.log("\n📋 Full Error Details:");
      console.log(error);
    }
  }
}

console.log("🧪 Email Configuration Test\n");
testEmail();
