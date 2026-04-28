"use client";

import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sparkles,
  ChevronRight,
  Star,
  Zap,
  TrendingUp,
  Play,
  Code,
} from "lucide-react";
import { stats, features, steps, testimonials, footerLinks } from "./data";

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, isLoaded, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-100 via-indigo-100 to-blue-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-indigo-50 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000" />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative container mx-auto px-4 py-6 flex items-center justify-between z-10"
      >
        <div className="flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="w-10 h-10 bg-linear-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg"
          >
            <Code className="w-5 h-5 text-white" />
          </motion.div>
          <span className="text-xl font-bold bg-linear-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            BuildSpace
          </span>
        </div>

        <div className="flex items-center gap-4">
          <SignInButton mode="modal">
            <Button
              variant="ghost"
              className="text-gray-700 hover:text-purple-600"
            >
              Sign In
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-linear-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-purple-500/25">
                Get Started
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </SignUpButton>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 py-20 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full border border-purple-200 mb-6"
          >
            <Zap className="w-4 h-4 text-purple-600" />
            <span className="text-sm text-purple-700 font-medium">
              Launching Soon
            </span>
          </motion.div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-linear-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
            Learn by Building
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Master modern web development through hands-on projects, earn
            achievements, compete with friends, and level up your career.
          </p>

          <div className="flex items-center justify-center gap-4">
            <SignUpButton mode="modal">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Button
                  size="lg"
                  className="bg-linear-to-r from-purple-600 to-indigo-600 text-white text-lg px-8 shadow-lg hover:shadow-xl"
                >
                  Start Learning Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </SignUpButton>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all"
            >
              <stat.icon
                className={`w-8 h-8 text-${stat.color}-600 mx-auto mb-3`}
              />
              <div className={`text-3xl font-bold text-${stat.color}-600`}>
                {stat.value}
              </div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative container mx-auto px-4 py-20 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900">
            Why Choose BuildSpace?
          </h2>
          <p className="text-gray-600 mt-4">
            Everything you need to become a developer
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: feature.delay }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group bg-white rounded-2xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="relative">
                <div className="w-16 h-16 bg-linear-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="relative container mx-auto px-4 py-20 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900">How It Works</h2>
          <p className="text-gray-600 mt-4">Get started in 4 simple steps</p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="relative">
                <div className="w-20 h-20 mx-auto bg-linear-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -right-4 top-8 hidden md:block">
                  {index < steps.length - 1 && (
                    <ChevronRight className="w-6 h-6 text-gray-400" />
                  )}
                </div>
              </div>
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {item.step}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative container mx-auto px-4 py-20 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900">
            Loved by Developers
          </h2>
          <p className="text-gray-600 mt-4">
            Join thousands of successful learners
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-4">"{testimonial.content}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-linear-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {testimonial.name[0]}
                  </span>
                </div>
                <div>
                  <p className="text-gray-900 font-semibold text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-gray-500 text-xs">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative container mx-auto px-4 py-20 z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-linear-to-r from-purple-600 via-pink-600 to-indigo-600 p-12 text-center shadow-xl"
        >
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium">
                Limited Time Offer
              </span>
            </motion.div>

            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of developers who are already building their future
              with BuildSpace
            </p>

            <SignUpButton mode="modal">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 shadow-lg"
                >
                  Get Started For Free
                  <TrendingUp className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </SignUpButton>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-gray-200 py-8 z-10 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-linear-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Code className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900">BuildSpace</span>
            </div>
            <div className="flex gap-6">
              {footerLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-gray-600 hover:text-purple-600 transition-colors text-sm"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              © 2024 BuildSpace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
