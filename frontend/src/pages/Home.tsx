import React, { useState, useEffect } from 'react';
import { Brain, Play, Award, ArrowRight, CheckCircle, Star, TrendingUp, Zap,  Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [statsAnimated, setStatsAnimated] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [splashProgress, setSplashProgress] = useState(0);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Data Analyst",
      company: "Microsoft",
      text: "ExcelMind transformed my Excel skills from basic to expert in just 3 months. The AI assistant is like having a personal tutor 24/7.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Financial Manager",
      company: "Goldman Sachs",
      text: "The VBA course was incredible. I went from knowing nothing about programming to automating complex financial models.",
      rating: 5
    },
    {
      name: "Emma Rodriguez",
      role: "Business Analyst",
      company: "Deloitte",
      text: "The real-world projects and personalized feedback helped me land my dream job. Best investment I've ever made!",
      rating: 5
    }
  ];

  const stats = [
    { number: "50K+", label: "Students Enrolled" },
    { number: "95%", label: "Success Rate" },
    { number: "4.9/5", label: "Student Rating" },
    { number: "24/7", label: "AI Support" }
  ];

  // Splash screen effect
  useEffect(() => {
    const progressTimer = setInterval(() => {
      setSplashProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          setTimeout(() => setShowSplash(false), 800);
          return 100;
        }
        return prev + 1.5;
      });
    }, 60);

    return () => clearInterval(progressTimer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsAnimated(true);
        }
      },
      { threshold: 0.1 }
    );

    const statsSection = document.getElementById('stats-section');
    if (statsSection) {
      observer.observe(statsSection);
    }

    return () => observer.disconnect();
  }, []);

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 z-50 flex items-center justify-center overflow-hidden">
        <style>{`
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes fade-in-up {
            from { 
              opacity: 0; 
              transform: translateY(30px); 
            }
            to { 
              opacity: 1; 
              transform: translateY(0); 
            }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
          
          @keyframes float-delay {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-30px) rotate(-180deg); }
          }
          
          @keyframes float-reverse {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(20px) rotate(180deg); }
          }
          
          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
            50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.8), 0 0 60px rgba(99, 102, 241, 0.3); }
          }
          
          .animate-spin-slow { animation: spin-slow 4s linear infinite; }
          .animate-fade-in-up { 
            animation: fade-in-up 1s ease-out forwards; 
          }
          .animate-fade-in-up-delay { 
            animation: fade-in-up 1s ease-out 0.5s forwards; 
            opacity: 0; 
          }
          .animate-float { animation: float 6s ease-in-out infinite; }
          .animate-float-delay { animation: float-delay 8s ease-in-out infinite; }
          .animate-float-reverse { animation: float-reverse 7s ease-in-out infinite; }
          .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        `}</style>
        
        <div className="text-center relative z-10">
          {/* Animated Logo */}
          <div className="relative mb-12">
            <div className="w-32 h-32 mx-auto mb-8 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-3xl animate-pulse opacity-30"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl flex items-center justify-center transform rotate-12 animate-spin-slow opacity-60">
                <Brain className="w-16 h-16 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center animate-pulse-glow">
                <Brain className="w-16 h-16 text-white" />
              </div>
            </div>
            
            {/* Animated Brand Name */}
            <h1 className="text-6xl font-bold text-white mb-6 animate-fade-in-up">
              ExcelMind
            </h1>
            <p className="text-2xl text-blue-200 animate-fade-in-up-delay">
              AI-Powered Excel Learning
            </p>
          </div>
          
          {/* Loading Progress */}
          <div className="w-96 mx-auto">
            <div className="bg-white/20 backdrop-blur-sm rounded-full h-3 mb-6 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 h-full rounded-full transition-all duration-300 ease-out relative"
                style={{ width: `${splashProgress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
              </div>
            </div>
            <div className="text-blue-200 text-lg font-medium">
              Loading your learning experience... {Math.round(splashProgress)}%
            </div>
          </div>
          
          {/* Animated Dots */}
          <div className="flex justify-center space-x-3 mt-10">
            <div className="w-4 h-4 bg-blue-400 rounded-full animate-bounce"></div>
            <div className="w-4 h-4 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-4 h-4 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
        
        {/* Background Animation */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-full animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-full animate-float-delay"></div>
          <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full animate-float-reverse"></div>
          <div className="absolute top-1/2 right-20 w-24 h-24 bg-gradient-to-br from-pink-600/20 to-red-600/20 rounded-full animate-float"></div>
          <div className="absolute bottom-20 left-1/2 w-40 h-40 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-full animate-float-reverse"></div>
        </div>
      </div>
    );
  }

  

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">ExcelMind</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#courses" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Courses</a>
              <a href="#features" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Features</a>
              <a href="#testimonials" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Reviews</a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Pricing</a>
              <Link to={`/signup`}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105">
                Start Learning
              </Link>
            </nav>

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-40 md:hidden">
          <div className="flex flex-col items-center justify-center h-full space-y-8 text-xl">
            <a href="#courses" className="text-gray-600 hover:text-blue-600 font-medium">Courses</a>
            <a href="#features" className="text-gray-600 hover:text-blue-600 font-medium">Features</a>
            <a href="#testimonials" className="text-gray-600 hover:text-blue-600 font-medium">Reviews</a>
            <a href="#pricing" className="text-gray-600 hover:text-blue-600 font-medium">Pricing</a>
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg">
              Start Learning
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Zap className="w-4 h-4 mr-2" />
              AI-Powered Excel Learning Platform
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Master Excel with
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block">
                AI-Powered Learning
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform from Excel beginner to data expert with personalized AI tutoring, 
              real-world projects, and industry-recognized certification.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
                Start Free Trial
              </button>
              <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                  <Play className="w-5 h-5 text-blue-600" />
                </div>
                <span className="font-medium">Watch Demo</span>
              </button>
            </div>
            
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Free 7-day trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats-section" className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-4xl md:text-5xl font-bold text-white mb-2 transition-all duration-1000 ${
                  statsAnimated ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
                }`} style={{ transitionDelay: `${index * 200}ms` }}>
                  {stat.number}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why ExcelMind?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform adapts to your learning style, making Excel mastery faster and more engaging than ever.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI-Powered Learning</h3>
              <p className="text-gray-600 leading-relaxed">
                Get personalized explanations, instant feedback, and adaptive learning paths tailored to your skill level and goals.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Real-World Projects</h3>
              <p className="text-gray-600 leading-relaxed">
                Practice with actual business scenarios from finance, marketing, and data analysis to build portfolio-ready skills.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Industry Certification</h3>
              <p className="text-gray-600 leading-relaxed">
                Earn recognized certifications that boost your resume and prove your expertise to employers worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Students Say</h2>
            <p className="text-xl text-gray-600">Join thousands of professionals who've transformed their careers</p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl max-w-4xl mx-auto">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <blockquote className="text-2xl text-gray-900 mb-8 leading-relaxed">
                "{testimonials[currentTestimonial].text}"
              </blockquote>
              
              <div className="flex items-center justify-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {testimonials[currentTestimonial].name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">{testimonials[currentTestimonial].name}</p>
                  <p className="text-gray-600">{testimonials[currentTestimonial].role} at {testimonials[currentTestimonial].company}</p>
                </div>
              </div>
              
              <div className="flex justify-center mt-8 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Excel Skills?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join over 50,000 professionals who've already advanced their careers with ExcelMind.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg">
              Start Free Trial
            </button>
            <button className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors">
              <span className="font-medium">View Pricing</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-blue-100">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>7-day free trial</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>30-day money-back guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">ExcelMind</span>
              </div>
              <p className="text-gray-400">
                Empowering professionals with AI-powered Excel mastery.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Courses</h4>
              <div className="space-y-2 text-gray-400">
                <p>Excel Fundamentals</p>
                <p>Advanced Formulas</p>
                <p>Data Analysis</p>
                <p>VBA Programming</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2 text-gray-400">
                <p>Help Center</p>
                <p>Contact Us</p>
                <p>Community</p>
                <p>Status</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-gray-400">
                <p>About</p>
                <p>Careers</p>
                <p>Privacy</p>
                <p>Terms</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 ExcelMind. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;