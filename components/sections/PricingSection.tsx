'use client';

import { motion } from 'framer-motion';
import { Check, Star, Car, Users, Shield } from 'lucide-react';

const plans = [
  {
    name: 'Free Trial',
    price: '₹0',
    duration: '30 days',
    description: 'Perfect for new drivers to get started',
    features: [
      'Full access to all features',
      'Unlimited bookings',
      'Real-time location tracking',
      'Customer support',
      'Profile verification',
    ],
    popular: false,
    color: 'border-blue-200 bg-blue-50',
    buttonColor: 'bg-blue-600 hover:bg-blue-700',
  },
  {
    name: 'Monthly Plan',
    price: '₹999',
    duration: 'per month',
    description: 'Best for active drivers',
    features: [
      'Everything in Free Trial',
      'Priority customer support',
      'Advanced analytics',
      'Marketing tools',
      'Insurance coverage',
      '24/7 driver support',
    ],
    popular: true,
    color: 'border-primary-200 bg-primary-50',
    buttonColor: 'bg-primary-600 hover:bg-primary-700',
  },
  {
    name: 'Annual Plan',
    price: '₹9,999',
    duration: 'per year',
    description: 'Save 17% with annual billing',
    features: [
      'Everything in Monthly Plan',
      '2 months free',
      'Exclusive driver benefits',
      'Premium support',
      'Training programs',
      'Vehicle maintenance tips',
    ],
    popular: false,
    color: 'border-green-200 bg-green-50',
    buttonColor: 'bg-green-600 hover:bg-green-700',
  },
];

const benefits = [
  {
    icon: Car,
    title: 'Flexible Vehicle Options',
    description: 'Support for hatchback, sedan, and SUV',
  },
  {
    icon: Users,
    title: 'Large Customer Base',
    description: 'Access to thousands of potential customers',
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    description: 'Safe and reliable payment processing',
  },
  {
    icon: Star,
    title: 'High Ratings',
    description: 'Build your reputation with customer reviews',
  },
];

export function PricingSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Driver Subscription Plans
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Choose the perfect plan for your driving business. Start with a free trial and upgrade when you're ready.
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={`relative card ${plan.color} ${plan.popular ? 'ring-2 ring-primary-500' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-2">{plan.duration}</span>
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <motion.li
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: (index * 0.1) + (featureIndex * 0.05) }}
                    className="flex items-center gap-3"
                  >
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </motion.li>
                ))}
              </ul>

              <button className={`w-full ${plan.buttonColor} text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200`}>
                {plan.name === 'Free Trial' ? 'Start Free Trial' : 'Choose Plan'}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-full mb-4">
                <benefit.icon className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">{benefit.title}</h4>
              <p className="text-gray-600 text-sm">{benefit.description}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to start earning?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of drivers who are already earning with Goa Taxi. 
              Start your free trial today and see the difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
                Become a Driver
              </button>
              <button className="border-2 border-primary-600 text-primary-600 font-semibold py-3 px-8 rounded-lg hover:bg-primary-600 hover:text-white transition-colors duration-200">
                Learn More
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
