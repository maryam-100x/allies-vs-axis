// server/bitqueryProxy.cjs
const express = require("express");
const cors = require("cors");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = 3001;

// Enable CORS for frontend
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.get("/api/bitquery", async (req, res) => {
  const { mint } = req.query;

  if (!mint) {
    return res.status(400).json({ error: "Missing mint parameter" });
  }

  console.log(`🔄 Fetching data for mint: ${mint}`);

  // Try using DexScreener API instead of BitQuery as it's more reliable for pump.fun tokens
  try {
    console.log("📡 Attempting DexScreener API call...");
    
    const dexResponse = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${mint}`);
    console.log(`📊 DexScreener response status: ${dexResponse.status}`);
    
    if (dexResponse.ok) {
      const dexData = await dexResponse.json();
      console.log("✅ DexScreener data received:", JSON.stringify(dexData, null, 2));
      
      if (dexData.pairs && dexData.pairs.length > 0) {
        const pair = dexData.pairs[0]; // Get the first trading pair
        
        const result = {
          marketCap: parseInt(pair.marketCap) || 0,
          volume24h: parseInt(pair.volume?.h24) || 0,
          price: parseFloat(pair.priceUsd) || 0,
          mint: mint,
          timestamp: new Date().toISOString()
        };
        
        console.log("📊 Returning DexScreener stats:", result);
        return res.json(result);
      }
    }
    
    console.log("⚠️ DexScreener failed, trying BitQuery...");
  } catch (dexError) {
    console.error("❌ DexScreener error:", dexError.message);
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
              Currency {
                Symbol
                Name
                MintAddress
              }
              Price
              AmountInUSD
            }
          }
          Block {
            Time
          }
        }
      }
    }
  `;

  try {
    console.log("📡 Attempting BitQuery API call...");
    
    const response = await fetch("https://graphql.bitquery.io/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": "ory_at_tba6xC1_H_Xe-grUuT2_r9W0nRML-FoPcjVefgH5CmM.UTBIHdKJbvj-gPfgld_FEu75e_nS2aFmtB3V2xYg4kc"
      },
      body: JSON.stringify({ 
        query, 
        variables: { address: mint } 
      }),
    });

    console.log(`📊 BitQuery response status: ${response.status}`);
    console.log(`📊 BitQuery response headers:`, Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log(`📄 BitQuery raw response (first 1000 chars):`, responseText.substring(0, 1000));

    if (!response.ok) {
      console.error("❌ BitQuery API error:", responseText);
      throw new Error(`BitQuery API returned ${response.status}: ${responseText}`);
    }

    let json;
    try {
      json = JSON.parse(responseText);
    } catch (parseError) {
      console.error("❌ Failed to parse BitQuery JSON:", parseError);
      throw new Error(`Invalid JSON from BitQuery: ${responseText.substring(0, 200)}`);
    }

    console.log("✅ BitQuery parsed JSON:", JSON.stringify(json, null, 2));

    if (json.errors) {
      console.error("❌ BitQuery GraphQL errors:", json.errors);
      throw new Error(`BitQuery GraphQL errors: ${JSON.stringify(json.errors)}`);
    }

    const trades = json?.data?.Solana?.DEXTrades || [];
    console.log(`📈 Found ${trades.length} trades`);

    if (trades.length === 0) {
      console.log("⚠️ No trades found, returning mock data");
      // Return mock data if no trades found
      const mockResult = {
        marketCap: Math.floor(Math.random() * 5000000) + 1000000,
        volume24h: Math.floor(Math.random() * 500000) + 50000,
        price: Math.random() * 0.01,
        mint: mint,
        timestamp: new Date().toISOString(),
        source: 'mock'
      };
      return res.json(mockResult);
    }

    // Process BitQuery data
    const latestTrade = trades[0];
    const latestPrice = parseFloat(latestTrade.Trade?.Buy?.Price) || 0;
    
    const volume24h = trades.reduce((sum, trade) => {
      return sum + (parseFloat(trade.Trade?.Buy?.AmountInUSD) || 0);
    }, 0);

    // Estimate market cap (this is a rough calculation)
    const marketCap = latestPrice * 1000000000; // Assuming 1B total supply

    const result = {
      marketCap: Math.round(marketCap),
      volume24h: Math.round(volume24h),
      price: latestPrice,
      mint: mint,
      timestamp: new Date().toISOString(),
      source: 'bitquery'
    };

    console.log("📊 Returning BitQuery stats:", result);
    res.json(result);

  } catch (err) {
    console.error("❌ All APIs failed:", err);
    
    // Return mock data as last resort
    const fallbackResult = {
      marketCap: Math.floor(Math.random() * 10000000) + 2000000,
      volume24h: Math.floor(Math.random() * 1000000) + 100000,
      price: Math.random() * 0.005,
      mint: mint,
      timestamp: new Date().toISOString(),
      source: 'fallback',
      error: err.message
    };
    
    console.log("🎭 Returning fallback data:", fallbackResult);
    res.json(fallbackResult);
  }
});

// Mock endpoint for testing
app.get("/api/mock-stats", (req, res) => {
  const { mint } = req.query;
  
  // Generate different mock data based on mint address
  const seed = mint ? mint.charCodeAt(0) : 0;
  const mockData = {
    marketCap: Math.floor((seed * 10000) % 8000000) + 2000000,
    volume24h: Math.floor((seed * 1000) % 800000) + 200000,
    price: ((seed * 0.001) % 0.008) + 0.002,
    mint: mint,
    timestamp: new Date().toISOString(),
    source: 'mock'
  };
  
  console.log("🎭 Returning mock data:", mockData);
  res.json(mockData);
});

// Test all endpoints
app.get("/test", async (req, res) => {
  const testMint = "C4ZKqN77JPR9z8rYY9JTtUQDx5b37mGiq1vYcHfNpump";
  
  try {
    // Test DexScreener
    console.log("🧪 Testing DexScreener...");
    const dexResponse = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${testMint}`);
    const dexData = await dexResponse.json();
    
    res.json({
      dexScreener: {
        status: dexResponse.status,
        data: dexData
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.json({
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Bitquery proxy running at http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`🎭 Mock endpoint: http://localhost:${PORT}/api/mock-stats?mint=test`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/test`);
});