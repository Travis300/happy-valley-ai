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

  if (response.ok) {
    return res.status(200).json({ success: true });
  } else {
    const err = await response.json();
    console.error('Resend error:', err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
