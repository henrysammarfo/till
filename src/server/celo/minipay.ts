/**
 * MiniPay deep-link helpers for in-app authorization.
 * Host: link.minipay.xyz (Celo MiniPay docs).
 */
export function minipayAuthorizeUrl(params: {
  jobId: string;
  token: string;
  amount: string;
  to: string;
  returnUrl: string;
}): string {
  const u = new URL("https://link.minipay.xyz/pay");
  u.searchParams.set("token", params.token);
  u.searchParams.set("amount", params.amount);
  u.searchParams.set("to", params.to);
  u.searchParams.set("ref", params.jobId);
  u.searchParams.set("redirect", params.returnUrl);
  return u.toString();
}

export function minipayOpenAppUrl(): string {
  return "https://link.minipay.xyz";
}
