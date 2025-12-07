'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FeaturedCategories } from "@/components/ui/test-category-card";
import { 
  BookOpen, 
  Award, 
  Users, 
  BarChart, 
  CheckCircle, 
  Clock, 
  Globe, 
  Shield,
  Star,
  ArrowRight
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative flex flex-1 items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-slate-100 bg-[size:20px_20px] opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-indigo-50/50" />
        
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              <Globe className="w-4 h-4 mr-2" />
              Trusted by 50,000+ language learners worldwide
            </div>
            
            <h1 className="mb-6 text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Master Any
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Language
              </span>
            </h1>
            
            <p className="mx-auto mb-8 max-w-3xl text-xl text-gray-600 leading-relaxed">
              The world's leading platform for language proficiency certification. 
              Test your skills with CEFR, HSK, and JLPT standardized assessments and earn internationally recognized certificates.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Button asChild size="lg" className="text-lg px-8 py-3">
                <Link href="/tests">
                  Explore Tests
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg" className="text-lg px-8 py-3">
                <Link href="/how-it-works">How it Works</Link>
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-gray-900">50K+</div>
                <div className="text-sm text-gray-600">Language Learners</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-gray-900">8</div>
                <div className="text-sm text-gray-600">Languages Available</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-gray-900">98%</div>
                <div className="text-sm text-gray-600">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-gray-900">CEFR</div>
                <div className="text-sm text-gray-600">Certified Standards</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Test Categories */}
      <FeaturedCategories limit={8} />

      {/* Features Section */}
      <section className="bg-white py-20">
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
              Everything you need to create, manage, and deliver professional certification programs
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="text-center h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <BookOpen className="mx-auto mb-4 h-12 w-12 text-blue-600" />
                  </motion.div>
                  <CardTitle>Advanced Test Builder</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Create comprehensive tests with multiple question types, 
                    multimedia support, and adaptive difficulty.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="text-center h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Award className="mx-auto mb-4 h-12 w-12 text-green-600" />
                  </motion.div>
                  <CardTitle>Instant Certificates</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Automatically generate beautiful, professional certificates 
                    with blockchain verification and sharing capabilities.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="text-center h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Users className="mx-auto mb-4 h-12 w-12 text-purple-600" />
                  </motion.div>
                  <CardTitle>Smart Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Track learner progress, identify knowledge gaps, and optimize 
                    your certification programs with AI-powered insights.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Card className="text-center h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Shield className="mx-auto mb-4 h-12 w-12 text-red-600" />
                  </motion.div>
                  <CardTitle>Enterprise Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Bank-level security with encrypted data, secure testing 
                    environments, and compliance with global standards.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Everything You Need to Succeed
              </h3>
              <div className="space-y-6">
                {[
                  { icon: CheckCircle, title: "Free Testing", desc: "Start with our comprehensive free tier" },
                  { icon: Clock, title: "Instant Results", desc: "Get immediate feedback and certificates" },
                  { icon: Globe, title: "Global Recognition", desc: "Certificates recognized worldwide" },
                  { icon: Shield, title: "Secure & Reliable", desc: "99.9% uptime with enterprise security" }
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    className="flex items-start space-x-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{item.title}</h4>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Sample Certificate</h4>
                  <p className="text-gray-600 mb-4">See what your learners will receive</p>
                  <Button variant="outline">
                    Preview Certificate
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of satisfied professionals who trust CertifyPro
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Training Manager",
                company: "TechCorp",
                content: "CertifyPro transformed our certification process. The automated certificate generation saves us hours every week.",
                rating: 5
              },
              {
                name: "Michael Chen",
                role: "HR Director",
                company: "Global Solutions",
                content: "The analytics features help us track employee progress and identify skill gaps effectively. Highly recommended!",
                rating: 5
              },
              {
                name: "Emily Davis",
                role: "Learning Specialist",
                company: "EduTech",
                content: "User-friendly interface and excellent customer support. Our learners love the instant certificate delivery.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 p-6 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}, {testimonial.company}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-3xl md:text-4xl font-bold">
              Ready to Transform Your Certification Program?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-blue-100">
              Join thousands of organizations using CertifyPro to deliver 
              world-class certification programs that learners love.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <Link href="/tests">Start Free Trial</Link>
              </Button>
              <Button variant="outline" asChild size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}