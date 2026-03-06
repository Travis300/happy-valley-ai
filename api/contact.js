module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstName, lastName, email, businessType, message } = req.body;

  if (!firstName || !lastName || !email || !businessType || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'onboarding@resend.dev',
      to: 'luke.surovec1@gmail.com',
      subject: `New enquiry from ${firstName} ${lastName}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Business Type:</strong> ${businessType}</p>
        <p><strong>Message:</strong> ${message}</p>
      `
    })
  });

  if (!response.ok) {
    const err = await response.json();
    console.error('Resend error:', err);
    return res.status(500).json({ error: 'Failed to send email' });
  }

  // Confirmation email to the inquirer
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'luke@happyvalleyai.co',
      to: email,
      subject: 'Thanks for reaching out — Happy Valley AI',
      html: `
        <p>Hi ${firstName},</p>
        <p>Thanks for getting in touch! We've received your message and will get back to you within 24 hours.</p>
        <p>In the meantime, feel free to check out our live demo bots at <a href="https://happyvalleyai.co/work">happyvalleyai.co/work</a> to see what we can build for your business.</p>
        <p>Talk soon,<br>Luke<br>Happy Valley AI<br>luke@happyvalleyai.co<br><a href="https://happyvalleyai.co">happyvalleyai.co</a></p>
      `
    })
  });

  return res.status(200).json({ success: true });
}
