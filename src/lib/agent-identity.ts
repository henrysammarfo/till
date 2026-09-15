/** Canonical on-chain / contest identity — keep UI in sync with env + registration.json */
export const AGENT_IDENTITY = {
  attributionTag: "celo_f30ff80110c6",
  wallet: "0x2879FBd50aBefb979270D2FFFD34d9ce1CecfF59",
  walletShort: "0x2879…fF59",
  erc8004Id: "9825",
  erc8004Url: "https://8004scan.io/agents/celo/9825",
  celoscanNftUrl:
    "https://celoscan.io/nft/0x8004a169fb4a3325136eb29fa0ceb6d2e539a432/9825",
  githubUrl: "https://github.com/henrysammarfo/till",
  githubShort: "github.com/henrysammarfo/till",
  telegramBot: "@TillPay_bot",
  telegramUrl: "https://t.me/TillPay_bot",
  primaryTrack: "real-world-adoption",
  network: "celo-mainnet",
} as const;
