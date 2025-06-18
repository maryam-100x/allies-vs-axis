export default function handler(req, res) {
  const { mint = "default" } = req.query;
  const seed = mint.charCodeAt(0);

  const data = {
    marketCap: Math.floor((seed * 10000) % 8000000) + 2000000,
    volume24h: Math.floor((seed * 1000) % 800000) + 200000,
    price: ((seed * 0.001) % 0.008) + 0.002,
    mint,
    timestamp: new Date().toISOString(),
    source: 'mock'
  };

  return res.status(200).json(data);
}
