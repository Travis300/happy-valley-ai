module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { plan } = req.body;

  const prices = {
    starter: process.env.STRIPE_PRICE_STARTER,
    growth:  process.env.STRIPE_PRICE_GROWTH,
    scale:   process.env.STRIPE_PRICE_SCALE,
  };

  const priceId = prices[plan];
  if (!priceId) return res.status(400).json({ error: 'Invalid plan' });

  const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      mode: 'subscription',
      'line_items[0][price]': priceId,
      'line_items[0][quantity]': '1',
      allow_promotion_codes: 'true',
      success_url: 'https://happyvalleyai.co/pricing?success=1',
      cancel_url:  'https://happyvalleyai.co/pricing',
    }).toString()
  });

  if (!response.ok) {
    const err = await response.json();
    console.error('Stripe error:', err);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }

  const session = await response.json();
  return res.status(200).json({ url: session.url });
};
