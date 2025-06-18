export default async function handler(req, res) {
  const testMint = "C4ZKqN77JPR9z8rYY9JTtUQDx5b37mGiq1vYcHfNpump";

  try {
    const dexResponse = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${testMint}`);
    const dexData = await dexResponse.json();

    return res.status(200).json({
      dexScreener: {
        status: dexResponse.status,
        data: dexData
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
