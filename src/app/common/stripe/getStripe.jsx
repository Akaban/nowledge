const API_KEY = process.env.REACT_APP_STRIPE_API_KEY

export default function getStripe() {
    if (window.Stripe)
        return window.Stripe(API_KEY);
    throw new Error("Cannot find Stripe")
}