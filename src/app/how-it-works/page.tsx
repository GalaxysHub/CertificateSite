'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Search, 
  BookOpen, 
  Clock, 
  Award,
  User,
  FileText,
  CheckCircle,
  Share2,
  ArrowRight,
  Play,
  Users,
  BarChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HowItWorksPage() {
  const steps = [
    {
      number: '01',
      title: 'Browse & Select',
      description: 'Explore our extensive catalog of certification tests across various industries and skill levels.',
      icon: Search,
      details: [
        'Filter by industry, skill level, or certification type',
        'Read detailed test descriptions and requirements',
        'Preview sample questions and format',
        'Check prerequisites and recommended preparation'
      ]
    },
    {
      number: '02',
      title: 'Prepare & Study',
      description: 'Access comprehensive study materials and practice tests to maximize your success.',
      icon: BookOpen,
      details: [
        'Download study guides and reference materials',
        'Take unlimited practice tests',
        'Track your progress with detailed analytics',
        'Join study groups and forums'
      ]
    },
    {
      number: '03',
      title: 'Take the Test',
      description: 'Complete your certification exam in a secure, proctored online environment.',
      icon: Clock,
      details: [
        'Schedule your exam at your convenience',
        'Secure browser with AI-powered proctoring',
        'Real-time technical support during exam',
        'Multiple question types and formats'
      ]
    },
    {
      number: '04',
      title: 'Get Certified',
      description: 'Receive your digital certificate instantly and share your achievement with the world.',
      icon: Award,
      details: [
        'Instant certificate generation upon passing',
        'Blockchain-verified credentials',
        'Professional PDF and digital badge formats',
        'Easy sharing on LinkedIn and social media'
      ]
    }
  ];

  const userTypes = [
    {
      icon: User,
      title: 'Individual Learners',
      description: 'Advance your career with industry-recognized certifications',
      features: [
        'Access to 500+ certification tests',
        'Personalized learning paths',
        'Progress tracking and analytics',
        'Lifetime certificate access'
      ],
      cta: 'Start Learning'
    },
    {
      icon: Users,
      title: 'Organizations',
      description: 'Build skilled teams with comprehensive certification programs',
      features: [
        'Bulk licensing and team management',
        'Custom certification programs',
        'Detailed reporting and analytics',
        'Integration with HR systems'
      ],
      cta: 'Contact Sales'
    },
    {
      icon: FileText,
      title: 'Content Creators',
      description: 'Create and monetize your certification programs',
      features: [
        'Easy-to-use test builder',
        'Revenue sharing program',
        'Marketing and promotion tools',
        'Student management dashboard'
      ],
      cta: 'Become a Partner'
    }
  ];

  const features = [
    {
      icon: CheckCircle,
      title: 'Instant Verification',
      description: 'All certificates are blockchain-verified for authenticity'
    },
    {
      icon: Share2,
      title: 'Easy Sharing',
      description: 'Share your achievements directly to LinkedIn and other platforms'
    },
    {
      icon: BarChart,
      title: 'Detailed Analytics',
      description: 'Track your progress and identify areas for improvement'
    },
    {
      icon: Play,
      title: 'Interactive Learning',
      description: 'Engage with multimedia content and simulations'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 bg-[size:20px_20px] opacity-40" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge variant="secondary" className="mb-4">
              Simple • Secure • Effective
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              How CertifyPro
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Works
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Get certified in 4 simple steps. From browsing tests to sharing your 
              achievements, we've made professional certification straightforward and accessible.
            </p>
            <Button asChild size="lg">
              <Link href="/tests">
                Get Started Now
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your Certification Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Follow these simple steps to earn your professional certification
            </p>
          </motion.div>

          <div className="space-y-16">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-blue-600 mb-1">
                        STEP {step.number}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {step.title}
                      </h3>
                    </div>
                  </div>
                  
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    {step.description}
                  </p>
                  
                  <div className="space-y-3">
                    {step.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 shadow-lg">
                      <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-xl flex items-center justify-center">
                        <step.icon className="w-16 h-16 text-blue-600" />
                      </div>
                      <div className="mt-6 text-center">
                        <div className="text-4xl font-bold text-gray-900 mb-2">
                          {step.number}
                        </div>
                        <div className="text-lg font-semibold text-gray-700">
                          {step.title}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Built for Everyone
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you're an individual learner, organization, or content creator, 
              CertifyPro has the right solution for you
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {userTypes.map((type, index) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                      <type.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {type.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-6">
                      {type.description}
                    </p>
                    
                    <div className="space-y-3 mb-8">
                      {type.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start space-x-3">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button className="w-full">
                      {type.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose CertifyPro?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced features that make certification simple, secure, and meaningful
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to know about getting certified
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {[
              {
                question: 'How long does it take to get certified?',
                answer: 'Most certifications can be completed in 1-4 hours, depending on the complexity. You receive your certificate instantly upon passing the exam.'
              },
              {
                question: 'Are the certificates recognized by employers?',
                answer: 'Yes! Our certificates are industry-recognized and accepted by thousands of employers worldwide. They are blockchain-verified for authenticity.'
              },
              {
                question: 'Can I retake a test if I don\'t pass?',
                answer: 'Absolutely. You can retake any test after a 24-hour waiting period. We also provide detailed feedback to help you improve.'
              },
              {
                question: 'Do you offer group pricing for organizations?',
                answer: 'Yes, we offer bulk licensing and special pricing for organizations. Contact our sales team for custom packages.'
              },
              {
                question: 'How do I verify a certificate\'s authenticity?',
                answer: 'Each certificate includes a unique blockchain hash that can be verified on our platform. Simply enter the certificate ID to confirm authenticity.'
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Get Certified?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have advanced their careers 
              with CertifyPro certifications.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <Link href="/tests">Browse Certifications</Link>
              </Button>
              <Button variant="outline" asChild size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Link href="/contact">Talk to Sales</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}