import nodemailer from 'nodemailer';

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER || "amariaclothing.info@gmail.com", // Your email user
    pass: process.env.EMAIL_PASS || "ikyo obzn fygk saju", // Your email app password
  },
});

// Function to send order confirmation email
export const sendOrderConfirmationEmail = (email: string, orderDetails: any): void => {
  const mailOptions = {
    from: 'amariaclothing.info@gmail.com', // Your email or company name
    to: email,
    subject: 'Your Order Confirmation - Amaria Clothing',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #f0f0f0; background-color: #333; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto;">
        <div style="border: 1px solid #444; padding: 20px; border-radius: 8px; background-color: #222;">
          <h2 style="color: #FFD700; text-align: center;">Amaria Clothing</h2>
          <h3 style="color: #f0f0f0;">Thank you for your order!</h3>
          <p style="color: #f0f0f0;">We are delighted to confirm your order. Below are the details:</p>
          <hr style="border: 1px solid #555;">
          ${orderDetails.items.map((item: any) => `
            <div style="margin-bottom: 15px;">
              <p><strong style="color: #FFD700;">Product:</strong> ${item.ProductName}</p>
              <p><strong style="color: #FFD700;">Size:</strong> ${item.selectedSize}</p>
              <p><strong style="color: #FFD700;">Quantity:</strong> ${item.Quantity}</p>
              <p><strong style="color: #FFD700;">Price:</strong> $${item.TotalPrice.toFixed(2)}</p>
            </div>
            <hr style="border: 1px solid #555;">
          `).join('')}
          <h3 style="color: #f0f0f0;">Total: $${orderDetails.items.reduce((total: number, item: any) => total + item.TotalPrice, 0).toFixed(2)}</h3>
          <p style="color: #f0f0f0;"><strong>Delivery Fee:</strong> $${orderDetails.deliveryFee.toFixed(2)}</p>
          <p style="color: #f0f0f0;"><strong>Phone:</strong> ${orderDetails.phoneNumber}</p>
          <p style="color: #f0f0f0;"><strong>Email:</strong> ${orderDetails.email}</p>
          <p style="color: #f0f0f0;"><strong>Address:</strong> ${orderDetails.address}</p>
          <p style="color: #f0f0f0;">Your order will be shipped to you soon. We'll notify you once it's on the way!</p>
          <p style="color: #f0f0f0;">If you have any questions or concerns, feel free to <a href="mailto:amariaclothing.info@gmail.com" style="color: #FFD700;">contact us</a>.</p>
          <p style="color: #f0f0f0;">Thank you for shopping with us!</p>
          <p style="color: #FFD700; text-align: center;"><strong>Amaria Clothing Team</strong></p>
          <hr style="border: 1px solid #555;">
          <p style="font-size: 12px; color: #888; text-align: center;">&copy; 2024 Amaria Clothing. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};
