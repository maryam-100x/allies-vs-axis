import { useEffect, useState } from "react"

export function useHolderCount() {
  const [alliesHolders, setAlliesHolders] = useState(null)
  const [axisHolders, setAxisHolders] = useState(null)

  useEffect(() => {
    const fetchHolders = async (mint, setFn) => {
      let allOwners = new Set()
      let cursor = undefined

      try {
        while (true) {
          const params = { limit: 1000, mint }
          if (cursor !== undefined) params.cursor = cursor

          const response = await fetch(import.meta.env.VITE_HELIUS_RPC, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              jsonrpc: "2.0",
              id: "get-holders",
              method: "getTokenAccounts",
              params
            })
          })

          const data = await response.json()

          if (!data.result || data.result.token_accounts.length === 0) break

          data.result.token_accounts.forEach((acc) => {
            allOwners.add(acc.owner)
          })

          cursor = data.result.cursor
          if (!cursor) break
        }

        setFn(allOwners.size)
      } catch (err) {
        console.error(`Failed to fetch holders for ${mint}:`, err)
      }
    }

    fetchHolders("3jTBVfWyb4wgicRFNKfnrYBPux13gEFqGWWSVfjppump", setAlliesHolders)
    fetchHolders("Et1nwX1U2PrS1A4iRvFcd6LGzYWh1C33iHvKWBCVpump", setAxisHolders)

    const interval = setInterval(() => {
      fetchHolders("3jTBVfWyb4wgicRFNKfnrYBPux13gEFqGWWSVfjppump", setAlliesHolders)
      fetchHolders("Et1nwX1U2PrS1A4iRvFcd6LGzYWh1C33iHvKWBCVpump", setAxisHolders)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  return { alliesHolders, axisHolders }
}
