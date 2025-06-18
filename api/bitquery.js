export default async function handler(req, res) {
  const { mint } = req.query;

  if (!mint) return res.status(400).json({ error: "Missing mint parameter" });

  console.log(`🔄 Fetching data for mint: ${mint}`);

  // DexScreener first
  try {
    const dexRes = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${mint}`);
    if (dexRes.ok) {
      const dexData = await dexRes.json();
      if (dexData?.pairs?.length > 0) {
        const pair = dexData.pairs[0];
        return res.status(200).json({
          marketCap: parseInt(pair.marketCap) || 0,
          volume24h: parseInt(pair.volume?.h24) || 0,
          price: parseFloat(pair.priceUsd) || 0,
          mint,
          timestamp: new Date().toISOString(),
          source: "dexscreener",
        });
      }
    }
  } catch (e) {
    console.error("❌ DexScreener failed:", e.message);
  }

  // Fallback to BitQuery
  const query = `
    query GetSolanaToken($address: String!) {
      Solana {
        DEXTrades(
          where: {
            Trade: {
              Buy: {
                Currency: {
                  MintAddress: {
                    is: $address
                  }
                }
              }
            }
          }
          orderBy: {descending: Block_Time}
          limit: 10
        ) {
          Trade {
            Buy {
              Price
              AmountInUSD
            }
          }
        }
      }
    }`;

  try {
    const response = await fetch("https://graphql.bitquery.io/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": process.env.X_API_KEY,
      },
      body: JSON.stringify({ query, variables: { address: mint } }),
    });

    const json = await response.json();

    const trades = json?.data?.Solana?.DEXTrades || [];
    const latest = trades[0];
    const price = parseFloat(latest?.Trade?.Buy?.Price || 0);
    const volume24h = trades.reduce((sum, t) => sum + parseFloat(t?.Trade?.Buy?.AmountInUSD || 0), 0);
    const marketCap = price * 1_000_000_000;

    return res.status(200).json({
      marketCap: Math.round(marketCap),
      volume24h: Math.round(volume24h),
      price,
      mint,
      timestamp: new Date().toISOString(),
      source: "bitquery",
    });
  } catch (err) {
    console.error("❌ BitQuery error:", err);
  }

  // Final fallback mock
  const fallback = {
    marketCap: Math.floor(Math.random() * 10_000_000 + 1_000_000),
    volume24h: Math.floor(Math.random() * 1_000_000 + 100_000),
    price: Math.random() * 0.01,
    mint,
    timestamp: new Date().toISOString(),
    source: "mock",
  };

  return res.status(200).json(fallback);
}
