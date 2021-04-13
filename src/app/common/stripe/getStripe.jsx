const API_KEY = "pk_test_51ISqELEzo05dH8Evxhtsqr0m9Fnkt9VoaKRZqowVjiVpeTII3qAFl2yDvVpI7NnbOSep7NbgMOQL89U7CVgmdPy900RIhNXb2T"

export default function getStripe() {
    if (window.Stripe)
        return window.Stripe(API_KEY);
    throw new Error("Cannot find Stripe")
}