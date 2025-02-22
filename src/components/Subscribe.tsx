//frontend/src/components/Subscribe.tsx

import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || '');

interface SubscribeProps {
  tier: string;
}

const Subscribe = ({ tier }: SubscribeProps) => {
  const handleSubscribe = async () => {
    const stripe = await stripePromise;
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('http://localhost:3000/api/create-checkout-session', { tier }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await stripe?.redirectToCheckout({ sessionId: response.data.id });
    } catch (error) {
      console.error('Subscription error:', error);
    }
  };

  return (
    <button
      onClick={handleSubscribe}
      className="bg-neonGreen text-darkGray px-6 py-3 rounded-full font-semibold hover:bg-green-600 transition"
    >
      Subscribe to {tier.charAt(0).toUpperCase() + tier.slice(1)}
    </button>
  );
};

export default Subscribe;