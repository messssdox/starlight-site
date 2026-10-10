// ─────────────────────────────────────────────────────────────────────────────
//  DONATIONS: THE ONE PLACE TO PLUG IN PAYMENTS
//
//  Donations go to Buy Me a Coffee (buymeacoffee.com/messss). The buttons open
//  that page in a new tab, where the visitor confirms their gift.
//
//  To switch provider later:
//    1. Create an account with ONE provider below.
//    2. Paste your link into `link`, and change `provider` to its name.
//    3. Save, commit and push. The live site updates by itself.
//
//  Nothing secret goes in this file. These are public links that anyone can see.
// ─────────────────────────────────────────────────────────────────────────────

export type Provider = "buymeacoffee" | "kofi" | "stripe" | "paypal" | null;

export const DONATIONS = {
  /** Which provider is connected. null = not connected yet. */
  provider: "buymeacoffee" as Provider,

  /**
   * Your public donation link, for example:
   *   Buy Me a Coffee: "https://buymeacoffee.com/yourname"
   *   Ko-fi:   "https://ko-fi.com/yourname"
   *   Stripe:  "https://donate.stripe.com/abc123"   (a Payment Link set to "customer chooses amount")
   *   PayPal:  "https://www.paypal.com/donate/?hosted_button_id=ABC123"
   */
  link: "https://buymeacoffee.com/messss",

  currency: "GBP",
  symbol: "£",
  /** The suggested amounts shown as buttons, in pounds. */
  amounts: [3, 5, 10, 20],

  message:
    "This website is completely free and will always be free. If you'd like to support this work, contributions are gratefully received — thank you for being part of this journey.",
};
