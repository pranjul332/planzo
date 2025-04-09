import React, { useState, useEffect, useRef, } from "react";
import { Link } from "react-router-dom";
import {
  Play,
  ChevronRight,
  Search,
  Calendar,
  Map,
  Star,
  CheckCircle,
  ArrowRight,
  Globe,
  Clock,
  Users,
  Menu,
  X,
  ChevronDown,
  MessageCircle,
  Brain,
  DollarSign,
  PlusCircle,
  Zap,
  BarChart,
  Route,
  Briefcase
} from "lucide-react";

import SignUp from "../../Auth/Signup";

export default function Front() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDestination, setActiveDestination] = useState(0);
  const [isVisible, setIsVisible] = useState({
    hero: false,
    destinations: false,
    howItWorks: false,
    video: false,
    testimonials: false,
    cta: false,
  });

  const heroRef = useRef(null);
  const destinationsRef = useRef(null);
  const howItWorksRef = useRef(null);
  const videoRef = useRef(null);
  const testimonialsRef = useRef(null);
  const ctaRef = useRef(null);
  const [isCreateTripModalOpen, setIsCreateTripModalOpen] = useState(false);

  // Featured destinations data
  const destinations = [
    {
      id: 1,
      name: "Santorini, Greece",
      description: "Experience breathtaking sunsets over the Aegean Sea",
      rating: 4.9,
      price: "$1,299",
      image:
        "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=2000&h=1000",
    },
    {
      id: 2,
      name: "Swiss Alps",
      description:
        "Explore majestic mountain peaks, crystal-clear lakes, and charming alpine villages.",
      rating: 4.9,
      price: "$1,499",
      image:
        "https://images.unsplash.com/photo-1531210483974-4f8c1f33fd35?auto=format&fit=crop&q=80&w=2000&h=1000",
    },
    {
      id: 3,
      name: "Bali, Indonesia",
      description: "Discover paradise beaches and lush rice terraces",
      rating: 4.7,
      price: "$999",
      image:
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=2000&h=1000",
    },
  ];

  // How it works steps
  const howItWorksSteps = [
    {
      id: 1,
      title: "Discover Destinations",
      description:
        "Browse our curated selection of exotic locations and exclusive experiences around the globe.",
      icon: <Globe className="w-8 h-8 text-blue-500" />,
    },
    {
      id: 2,
      title: "Personalize Your Journey",
      description:
        "Customize every aspect of your trip with our intuitive booking tools and expert recommendations.",
      icon: <Users className="w-8 h-8 text-blue-500" />,
    },
    {
      id: 3,
      title: "Book with Confidence",
      description:
        "Secure your adventure with our transparent pricing and flexible cancellation options.",
      icon: <CheckCircle className="w-8 h-8 text-blue-500" />,
    },
    {
      id: 4,
      title: "Travel Seamlessly",
      description:
        "Enjoy 24/7 support during your journey with our dedicated travel concierge service.",
      icon: <Clock className="w-8 h-8 text-blue-500" />,
    },
  ];

  // Testimonials
  const testimonials = [
    {
      id: 1,
      quote:
        "The most seamless travel experience I've ever had. Every detail was perfectly arranged!",
      author: "Sarah Mitchell",
      role: "Adventure Traveler",
      avatar: "/api/placeholder/60/60",
    },
    {
      id: 2,
      quote:
        "Our family trip was magical thanks to the personalized itinerary and local insights.",
      author: "David Chen",
      role: "Family Explorer",
      avatar: "/api/placeholder/60/60",
    },
  ];

 

  // Auto-rotate featured destinations
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDestination((prev) => (prev + 1) % destinations.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [destinations.length]);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: "0px 0px -100px 0px",
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === heroRef.current)
            setIsVisible((prev) => ({ ...prev, hero: true }));
          if (entry.target === destinationsRef.current)
            setIsVisible((prev) => ({ ...prev, destinations: true }));
          if (entry.target === howItWorksRef.current)
            setIsVisible((prev) => ({ ...prev, howItWorks: true }));
          if (entry.target === videoRef.current)
            setIsVisible((prev) => ({ ...prev, video: true }));
          if (entry.target === testimonialsRef.current)
            setIsVisible((prev) => ({ ...prev, testimonials: true }));
          if (entry.target === ctaRef.current)
            setIsVisible((prev) => ({ ...prev, cta: true }));
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    if (heroRef.current) observer.observe(heroRef.current);
    if (destinationsRef.current) observer.observe(destinationsRef.current);
    if (howItWorksRef.current) observer.observe(howItWorksRef.current);
    if (videoRef.current) observer.observe(videoRef.current);
    if (testimonialsRef.current) observer.observe(testimonialsRef.current);
    if (ctaRef.current) observer.observe(ctaRef.current);

    // Trigger hero animation immediately
    setTimeout(() => {
      setIsVisible((prev) => ({ ...prev, hero: true }));
    }, 100);

    return () => {
      if (heroRef.current) observer.unobserve(heroRef.current);
      if (destinationsRef.current) observer.unobserve(destinationsRef.current);
      if (howItWorksRef.current) observer.unobserve(howItWorksRef.current);
      if (videoRef.current) observer.unobserve(videoRef.current);
      if (testimonialsRef.current) observer.unobserve(testimonialsRef.current);
      if (ctaRef.current) observer.unobserve(ctaRef.current);
    };
  }, []);

  // Scroll indicator animation
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navigation */}
      <nav
        className={`fixed w-full top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-md py-2"
            : "bg-transparent py-4"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                Planzo
              </div>
              <div className="hidden md:flex space-x-6">
                <a
                  href="#destinations"
                  className="text-gray-600 hover:text-blue-600 transition-colors relative group"
                >
                  Destinations
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a
                  href="#how-it-works"
                  className="text-gray-600 hover:text-blue-600 transition-colors relative group"
                >
                  How It Works
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a
                  href="#testimonials"
                  className="text-gray-600 hover:text-blue-600 transition-colors relative group"
                >
                  Testimonials
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </a>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              {/* <a
                href="/login"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Login
              </a> */}
              <a className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105">
                <button>
                  <SignUp />
                </button>
              </a>
            </div>
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        <div
          className={`md:hidden bg-white/95 backdrop-blur-md shadow-lg absolute w-full left-0 right-0 transition-all duration-500 ease-in-out overflow-hidden ${
            isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col space-y-3 p-4">
            <a
              href="#destinations"
              className="text-gray-600 hover:text-blue-600 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Destinations
            </a>
            <a
              href="#how-it-works"
              className="text-gray-600 hover:text-blue-600 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </a>
            <a
              href="#testimonials"
              className="text-gray-600 hover:text-blue-600 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Testimonials
            </a>
            {/* <a
              href="/login"
              className="text-gray-600 hover:text-blue-600 transition-colors py-2"
            >
              Login
            </a> */}
            <button>
              <a className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors text-center">
                <SignUp />
              </a>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 via-blue-700 to-blue-500 overflow-hidden"
      >
        {/* Abstract background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-400 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute top-1/3 -left-20 w-80 h-80 bg-purple-500 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-teal-400 rounded-full opacity-20 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 z-10">
          <div
            className={`max-w-3xl mx-auto text-center transition-all duration-1000 transform ${
              isVisible.hero
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Plan Group Trips{" "}
              <span className="relative">
                <span className="relative z-10">Without The Chaos</span>
                <span className="absolute -bottom-2 left-0 right-0 h-3 bg-blue-400 opacity-50 rounded"></span>
              </span>
            </h1>
            <p className="text-xl text-blue-100 mb-10">
              Create your crew, plan together, and let our AI handle the
              complicated stuff.
            </p>

            {/* Feature cards grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <div className="bg-white/10 backdrop-blur-sm p-5 rounded-xl border border-white/20 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer">
                <Users className="w-8 h-8 text-blue-100 mb-3 mx-auto" />
                <h3 className="text-white font-semibold">Group Planning</h3>
                <p className="text-blue-100 text-sm mt-1">
                  Invite friends & plan together
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-5 rounded-xl border border-white/20 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer">
                <MessageCircle className="w-8 h-8 text-blue-100 mb-3 mx-auto" />
                <h3 className="text-white font-semibold">Group Chat</h3>
                <p className="text-blue-100 text-sm mt-1">
                  Keep all communications in one place
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-5 rounded-xl border border-white/20 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer">
                <Brain className="w-8 h-8 text-blue-100 mb-3 mx-auto" />
                <h3 className="text-white font-semibold">AI Suggestions</h3>
                <p className="text-blue-100 text-sm mt-1">
                  Smart recommendations tailored to your group
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-5 rounded-xl border border-white/20 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer">
                <DollarSign className="w-8 h-8 text-blue-100 mb-3 mx-auto" />
                <h3 className="text-white font-semibold">Budget Master</h3>
                <p className="text-blue-100 text-sm mt-1">
                  Track expenses & split costs easily
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center">
              <Link to={"/trip/manageTrip"}>
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-10 py-4 rounded-full text-lg font-medium shadow-lg transition-all duration-300 hover:shadow-xl hover:transform hover:scale-105 flex items-center gap-2">
                  <PlusCircle className="w-5 h-5" />
                  Create Your Trip Group
                </button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Zap className="w-5 h-5 text-white mr-2" />
                <span className="text-white">AI Trip Estimation</span>
              </div>
              <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <BarChart className="w-5 h-5 text-white mr-2" />
                <span className="text-white">Budget Overview</span>
              </div>
              <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Route className="w-5 h-5 text-white mr-2" />
                <span className="text-white">Trip Flow Navigator</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <a
            href="#how-it-works"
            className="flex flex-col items-center text-white opacity-80 hover:opacity-100 transition-opacity"
          >
            <span className="mb-2 text-sm">See How It Works</span>
            <ChevronDown className="w-6 h-6" />
          </a>
        </div>
      </section>

      {/* Call to Action */}
      <div ref={ctaRef} className="bg-white py-24">
        <div className="container mx-auto px-4 text-center">
          <div
            className={`max-w-3xl mx-auto transition-all duration-1000 ${
              isVisible.cta
                ? "opacity-100 transform translate-y-0"
                : "opacity-0 transform translate-y-10"
            }`}
          >
            <div className="relative inline-block mb-8">
              <span className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 blur opacity-25"></span>
              <h2 className="relative text-3xl md:text-4xl font-bold">
                Ready to Begin Your Adventure?
              </h2>
            </div>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Join thousands of satisfied travelers who have experienced the
              world with us.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/flights"
                className="group relative px-8 py-4 overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <span className="absolute top-0 right-full w-full h-full bg-white opacity-20 transform -skew-x-45 transition-all duration-500 ease-out group-hover:right-0"></span>
                <span className="relative flex items-center justify-center">
                  Book Your Trip{" "}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
              <a
                href="/trip/manageTrip"
                className="bg-transparent border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-full text-lg font-medium hover:bg-blue-50 transition-colors hover:shadow-lg"
              >
                Manage Existing Trip
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Destinations */}
      <div
        id="destinations"
        ref={destinationsRef}
        className="container mx-auto px-4 py-24"
      >
        <div
          className={`text-center mb-12 transition-all duration-1000 ${
            isVisible.destinations
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform translate-y-10"
          }`}
        >
          <div className="inline-block mb-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
              Explore
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Popular Destinations
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our handpicked destinations loved by travelers worldwide.
          </p>
        </div>

        <div
          className={`relative overflow-hidden rounded-3xl shadow-2xl transition-all duration-1000 transform ${
            isVisible.destinations
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-10 scale-95"
          }`}
        >
          {destinations.map((destination, index) => (
            <div
              key={destination.id}
              className={`transition-all duration-1000 ${
                index === activeDestination
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 absolute inset-0"
              }`}
            >
              <div className="relative h-96 md:h-128">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover transition-transform duration-10000 transform scale-100 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white">
                  <div className="overflow-hidden">
                    <h3 className="text-2xl md:text-3xl font-bold mb-2 transform transition-transform duration-700 translate-y-0">
                      {destination.name}
                    </h3>
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-lg text-gray-200 mb-4 transform transition-transform duration-700 delay-100 translate-y-0">
                      {destination.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="ml-2">{destination.rating} rating</span>
                    </div>
                    <div className="text-xl font-bold">
                      From {destination.price}
                    </div>
                  </div>
                  <button className="mt-6 bg-white text-blue-600 px-6 py-2 rounded-full hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 flex items-center">
                    View Details <ChevronRight className="ml-1 w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
            {destinations.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveDestination(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeDestination ? "bg-white w-8" : "bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <a
            href="/destinations"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium group"
          >
            View all destinations{" "}
            <ChevronRight className="ml-1 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" ref={howItWorksRef} className="bg-gray-50 py-24">
        <div className="container mx-auto px-4">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${
              isVisible.howItWorks
                ? "opacity-100 transform translate-y-0"
                : "opacity-0 transform translate-y-10"
            }`}
          >
            <div className="inline-block mb-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
                Simple Process
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Plan Better, Together
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From creating your trip group to booking your adventure - all in
              one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connection lines (visible on lg screens) */}
            <div className="hidden lg:block absolute top-1/3 left-1/4 w-1/2 border-t-2 border-dashed border-blue-300 z-0"></div>
            <div className="hidden lg:block absolute top-1/3 right-1/4 w-1/2 border-t-2 border-dashed border-blue-300 z-0"></div>
            <div className="hidden lg:block absolute top-1/3 left-0 right-0 w-full border-t-2 border-dashed border-blue-300 z-0"></div>

            {/* Step 1 */}
            <div
              className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 transform relative z-10 ${
                isVisible.howItWorks
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "0ms" }}
            >
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6 mx-auto transform transition-all duration-500 hover:scale-110 hover:bg-blue-200">
                <div className="w-8 h-8 text-blue-600">
                  <Users className="w-full h-full" />
                </div>
              </div>
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">
                Create Your Crew
              </h3>
              <p className="text-gray-600 text-center">
                Start a trip group and invite your friends to join the planning
                process.
              </p>
            </div>

            {/* Step 2 */}
            <div
              className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 transform relative z-10 ${
                isVisible.howItWorks
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "150ms" }}
            >
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6 mx-auto transform transition-all duration-500 hover:scale-110 hover:bg-blue-200">
                <div className="w-8 h-8 text-blue-600">
                  <MessageCircle className="w-full h-full" />
                </div>
              </div>
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">
                Plan Together
              </h3>
              <p className="text-gray-600 text-center">
                Collaborate using the group chat to discuss ideas and make
                decisions together.
              </p>
             
            </div>

            {/* Step 3 */}
            <div
              className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 transform relative z-10 ${
                isVisible.howItWorks
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6 mx-auto transform transition-all duration-500 hover:scale-110 hover:bg-blue-200">
                <div className="w-8 h-8 text-blue-600">
                  <Brain className="w-full h-full" />
                </div>
              </div>
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">
                Use Smart Tools
              </h3>
              <p className="text-gray-600 text-center">
                Leverage AI trip suggestions, budget estimation, and trip flow
                planning tools.
              </p>
              
            </div>

            {/* Step 4 */}
            <div
              className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 transform relative z-10 ${
                isVisible.howItWorks
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "450ms" }}
            >
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6 mx-auto transform transition-all duration-500 hover:scale-110 hover:bg-blue-200">
                <div className="w-8 h-8 text-blue-600">
                  <Briefcase className="w-full h-full" />
                </div>
              </div>
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">
                Book & Go
              </h3>
              <p className="text-gray-600 text-center">
                Finalize your plans and book your trip with our secure payment
                system.
              </p>
              
            </div>
          </div>

          {/* Bottom testimonial/stats section */}
          <div className="mt-16 bg-blue-600 rounded-xl p-8 text-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">94%</div>
                <p className="text-blue-100">
                  of groups report easier planning
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">15hrs</div>
                <p className="text-blue-100">average time saved per trip</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">18%</div>
                <p className="text-blue-100">
                  average cost savings with AI tools
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Section */}
      <div ref={videoRef} className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div
            className={`text-center mb-12 transition-all duration-1000 ${
              isVisible.video
                ? "opacity-100 transform translate-y-0"
                : "opacity-0 transform translate-y-10"
            }`}
          >
            <div className="inline-block mb-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
                Watch
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Experience the Journey
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              See how it can help your trip planning
            </p>
          </div>

          <div
            className={`max-w-4xl mx-auto relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-1000 ${
              isVisible.video
                ? "opacity-100 transform translate-y-0 scale-100"
                : "opacity-0 transform translate-y-10 scale-95"
            }`}
          >
            <div className="absolute inset-0  opacity-75 z-10 flex items-center justify-center transition-opacity duration-300 hover:opacity-30">
              <button className="bg-white/90 backdrop-blur-sm w-20 h-20 rounded-full flex items-center justify-center transform transition-transform duration-300 hover:scale-110">
                <Play className="w-8 h-8 text-blue-600 ml-1" />
              </button>
            </div>
            <div
              className="relative pt-0 pb-0 h-0"
              style={{ paddingBottom: "56.25%" }}
            >
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Travel Experience Showcase"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div
        id="testimonials"
        ref={testimonialsRef}
        className="bg-gradient-to-br from-blue-900 to-purple-900 text-white py-24"
      >
        <div className="container mx-auto px-4">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${
              isVisible.testimonials
                ? "opacity-100 transform translate-y-0"
                : "opacity-0 transform translate-y-10"
            }`}
          >
            <div className="inline-block mb-2">
              <span className="px-3 py-1 bg-blue-700/30 text-blue-100 text-sm rounded-full font-medium">
                Reviews
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Travelers Say
            </h2>
            <p className="text-blue-200 max-w-2xl mx-auto">
              Join thousands who have experienced unforgettable journeys.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/15 transition-all duration-500 transform ${
                  isVisible.testimonials
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="flex mb-4 items-center">
                  <div className="mr-4 relative">
                    <div className="absolute inset-0 -m-1 bg-gradient-to-tr from-blue-400 to-purple-400 rounded-full animate-spin-slow"></div>
                    <div className="relative">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.author}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium">{testimonial.author}</h4>
                    <p className="text-blue-300 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="italic text-blue-100">"{testimonial.quote}"</p>
                <div className="mt-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
