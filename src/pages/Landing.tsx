// frontend/src/pages/Landing.tsx

import { type ReactElement } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Subscribe from '../components/Subscribe';

const MotionDiv = motion.div;
const MotionH1 = motion.h1;
const MotionP = motion.p;

const Landing = (): ReactElement => {
  return (
    <main className="pt-24 p-6 max-w-7xl mx-auto text-center">
      <MotionH1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl font-bold mb-4"
      >
        Unlock High-Profit Crypto Investments
      </MotionH1>
      <MotionP
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-gray-400 mb-6 text-lg"
      >
        Real-time insights powered by advanced analytics and AI.
      </MotionP>
      <MotionDiv
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Link
          to="/app"
          className="inline-block bg-neonGreen text-darkGray px-8 py-3 rounded-full font-semibold hover:bg-green-600 transition mr-4"
        >
          Try the Dashboard
        </Link>
        <Subscribe tier="premium" />
      </MotionDiv>
      <section id="features" className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {['Real-Time Data', 'Predictive Analytics', 'Custom Alerts'].map((feature, index) => (
          <MotionDiv
            key={feature}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 + index * 0.2 }}
            className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-700/50"
          >
            <h3 className="text-xl font-semibold">{feature}</h3>
            <p className="text-gray-400 mt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </MotionDiv>
        ))}
      </section>
    </main>
  );
};

export default Landing;