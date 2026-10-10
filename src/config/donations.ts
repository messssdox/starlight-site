// ─────────────────────────────────────────────────────────────────────────────
//  DONATIONS: THE ONE PLACE TO PLUG IN PAYMENTS
//
//  The donation box is fully designed and working, but no payment provider is
//  connected yet, so it shows a gentle "opening soon" thank-you instead.
//
//  When you're ready (see "Turning on donations" in the step-by-step guide):
//    1. Create an account with ONE provider below.
//    2. Paste your link into `link`, and change `provider` from null to its name.
//    3. Save, commit and push. The live site updates by itself.
//
//  Nothing secret goes in this file. These are public links that anyone can see.
// ─────────────────────────────────────────────────────────────────────────────

export type Provider = "kofi" | "stripe" | "paypal" | null;

export const DONATIONS = {
  /** Which provider is connected. null = not connected yet. */
  provider: null as Provider,

  /**
   * Your public donation link, for example:
   *   Ko-fi:   "https://ko-fi.com/yourname"
   *   Stripe:  "https://donate.stripe.com/abc123"   (a Payment Link set to "customer chooses amount")
   *   PayPal:  "https://www.paypal.com/donate/?hosted_button_id=ABC123"
   */
  link: "",

  currency: "GBP",
  symbol: "£",
  /** The suggested amounts shown as buttons, in pounds. */
  amounts: [3, 5, 10, 20],

  message:
    "This website is completely free and will always be free. If you'd like to support this work, contributions are gratefully received — thank you for being part of this journey.",
};
