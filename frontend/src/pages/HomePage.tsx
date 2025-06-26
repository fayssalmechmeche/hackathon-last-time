import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import {
  Search,
  Music,
  Video,
  TrendingUp,
  Palette,
  Lightbulb,
  Database,
  Building,
  Edit3,
  Play,
  MapPin,
  DollarSign,
  Globe,
  Plus,
  Minus,
  ArrowRight,
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
} from "lucide-react";

const NexolvePage = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [isVisible, setIsVisible] = useState({});

  // Animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const elements = document.querySelectorAll("[data-animate]");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const services = [
    {
      name: "Writing & Translation",
      icon: Edit3,
      gradient: "from-pink-500/20 to-pink-600/20",
      iconBg: "from-pink-500 to-rose-500",
      border: "border-pink-500/30",
    },
    {
      name: "Music & Audio",
      icon: Music,
      gradient: "from-purple-500/20 to-purple-600/20",
      iconBg: "from-purple-500 to-indigo-500",
      border: "border-purple-500/30",
    },
    {
      name: "Business",
      icon: Building,
      gradient: "from-blue-500/20 to-blue-600/20",
      iconBg: "from-blue-500 to-cyan-500",
      border: "border-blue-500/30",
    },
    {
      name: "Video & Animation",
      icon: Video,
      gradient: "from-indigo-500/20 to-indigo-600/20",
      iconBg: "from-indigo-500 to-purple-500",
      border: "border-indigo-500/30",
    },
    {
      name: "Digital Marketing",
      icon: TrendingUp,
      gradient: "from-cyan-500/20 to-cyan-600/20",
      iconBg: "from-cyan-500 to-teal-500",
      border: "border-cyan-500/30",
    },
    {
      name: "Graphics & Design",
      icon: Palette,
      gradient: "from-red-500/20 to-red-600/20",
      iconBg: "from-red-500 to-pink-500",
      border: "border-red-500/30",
    },
    {
      name: "AI Services",
      icon: Lightbulb,
      gradient: "from-green-500/20 to-emerald-600/20",
      iconBg: "from-green-500 to-emerald-500",
      border: "border-green-500/30",
    },
    {
      name: "Data",
      icon: Database,
      gradient: "from-gray-500/20 to-gray-600/20",
      iconBg: "from-gray-500 to-gray-600",
      border: "border-gray-500/30",
    },
  ];

  const jobs = [
    {
      title: "Software Tester",
      company: "Zenisk",
      logo: "Z",
      logoColor: "bg-red-500 text-white",
      location: "Remote",
      salary: "$60k - $80k",
      description:
        "Combining strategy with Product Research, Quality Assurance Testing & Community Management...",
      isRemote: true,
    },
    {
      title: "Software Developer",
      company: "Facebook",
      logo: "f",
      logoColor: "bg-blue-500 text-white",
      location: "CA, Menlo",
      salary: "$120k/month",
      description:
        "Collaborate closely with Product Research, Quality Assurance Testing & Community Platforms...",
      isRemote: false,
    },
    {
      title: "UI/UX Designer",
      company: "Spotify",
      logo: "S",
      logoColor: "bg-green-500 text-white",
      location: "Remote",
      salary: "$80k - $120k/month",
      description:
        "Collaborate closely with Product Research, Quality Assurance Testing & Community Forums...",
      isRemote: true,
    },
  ];

  const stats = [
    { number: "8M+", label: "Services Delivered" },
    { number: "150K+", label: "Happy Customers" },
    { number: "10M+", label: "Orders Completed" },
    { number: "24/7", label: "Support Available" },
  ];

  const features = [
    {
      title: "CONNECT DIRECTLY",
      description:
        "Chat directly with recruiters on the platform. We have features that help you stand out efficiently and transparently for both parties.",
      icon: "dots",
      gradient: "from-gray-800/50 to-gray-700/50",
    },
    {
      title: "UNIQUE JOBS AT STARTUP AND TECH COMPANIES",
      description:
        "Over 200k of Remote and local tech startups and tech companies. We love the unique jobs that are only found here.",
      icon: Building,
      gradient: "from-red-500/20 to-orange-500/20",
    },
    {
      title: "ONE CLICK TO APPLY",
      description:
        "No long forms - just apply with information that is used from your setup. Spend less time on paperwork, more time for opportunities.",
      icon: Play,
      gradient: "from-blue-500/20 to-indigo-500/20",
    },
    {
      title: "EVERYTHING YOU NEED TO KNOW, ALL UPFRONT",
      description:
        "Everything you need to know is upfront, salary, equity, culture, location, and remote opportunities - transparency at its finest.",
      icon: MapPin,
      gradient: "from-purple-500/20 to-pink-500/20",
    },
  ];

  const faqs = [
    "How did your business come?",
    "How to discover an individual?",
    "What is project essentials service software?",
    "How do I hire a consultant to do research assessments?",
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <Layout>
      <div className="bg-dark text-white min-h-screen">
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-dark">
          <div
            className="container mx-auto px-4 text-center"
            id="hero"
            data-animate
          >
            <h1
              className={`text-4xl md:text-6xl font-bold mb-6 leading-tight transition-all duration-700 ${
                isVisible.hero
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              Prestations{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                intelligentes
              </span>
            </h1>
            <p
              className={`text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8 transition-all duration-700 delay-200 ${
                isVisible.hero
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              Notre IA vous permet de déposer votre service et de trouver les
              prestataires qui correspondent à vos besoins.
            </p>
            <button
              className={`bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-4 rounded-lg text-lg font-medium hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg ${
                isVisible.hero
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              } delay-300`}
            >
              Voir les services disponibles
            </button>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 bg-dark">
          <div className="container mx-auto px-4" id="services" data-animate>
            <div
              className={`grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 transition-all duration-700 ${
                isVisible.services
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              {services.map((service, index) => {
                const IconComponent = service.icon;
                return (
                  <div
                    key={service.name}
                    className={`bg-gradient-to-br ${service.gradient} border ${service.border} bg-dark backdrop-blur-sm p-6 rounded-2xl cursor-pointer transition-all hover:transform hover:-translate-y-2 hover:shadow-xl hover:bg-dark duration-300`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${service.iconBg} rounded-xl flex items-center justify-center mb-4`}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-white mb-2">
                      {service.name}
                    </h3>
                    <span className="text-xs text-gray-400 bg-dark px-2 py-1 rounded-full">
                      →
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Explore Section */}
        <section className="py-16 bg-dark">
          <div className="container mx-auto px-4" id="explore" data-animate>
            <div
              className={`text-center mb-12 transition-all duration-700 ${
                isVisible.explore
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Explore Nexolve
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Search by the company name of site
              </p>
            </div>

            {/* Search and Filters */}
            <div
              className={`max-w-4xl mx-auto mb-12 transition-all duration-700 delay-200 ${
                isVisible.explore
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-3 bg-dark border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {["Country", "Region", "City", "Job Type"].map((filter) => (
                    <select
                      key={filter}
                      className="px-4 py-3 bg-dark border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    >
                      <option>{filter}</option>
                    </select>
                  ))}
                  <button className="px-6 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors font-medium">
                    Search
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div
              className={`grid grid-cols-2 md:grid-cols-4 gap-8 text-center mb-16 transition-all duration-700 delay-300 ${
                isVisible.explore
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="transform hover:scale-105 transition-transform duration-300"
                >
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Urgently Hiring Section */}
        <section className="py-16 bg-dark">
          <div className="container mx-auto px-4" id="jobs" data-animate>
            <h2
              className={`text-3xl md:text-4xl font-bold text-center mb-12 text-white transition-all duration-700 ${
                isVisible.jobs
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              Urgently Hiring
            </h2>

            <div
              className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-700 delay-200 ${
                isVisible.jobs
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              {jobs.map((job, index) => (
                <div
                  key={index}
                  className="bg-dark border border-gray-700 rounded-2xl p-6 hover:transform hover:-translate-y-2 hover:shadow-xl hover:bg-dark duration-300"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex items-start space-x-4 mb-4">
                    <div
                      className={`w-12 h-12 ${job.logoColor} rounded-lg flex items-center justify-center`}
                    >
                      <span className="font-bold">{job.logo}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{job.title}</h3>
                      <p className="text-gray-400 text-sm">@ {job.company}</p>
                      <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                        <span className="flex items-center">
                          {job.isRemote ? (
                            <Globe className="w-3 h-3 mr-1" />
                          ) : (
                            <MapPin className="w-3 h-3 mr-1" />
                          )}
                          {job.location}
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="w-3 h-3 mr-1" />
                          {job.salary}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">
                    {job.description}
                  </p>
                  <button className="w-full bg-white text-gray-900 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium">
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Find Talent Section */}
        <section className="py-16 bg-dark">
          <div className="container mx-auto px-4" id="talent" data-animate>
            <div
              className={`text-center mb-12 transition-all duration-700 ${
                isVisible.talent
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Find Talent Your Way
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Work with the largest network of independent professionals and
                get things done—from quick turnarounds to big transformations.
              </p>
            </div>

            <div
              className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-700 delay-200 ${
                isVisible.talent
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              {[
                {
                  title: "Post a job and hire a pro",
                  subtitle: "Talent Marketplace ™",
                },
                {
                  title: "Browse and buy projects",
                  subtitle: "Project Catalog ™",
                },
                {
                  title: "Get advice from an industry expert",
                  subtitle: "Consultations",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-dark p-8 rounded-2xl hover:bg-dark transition-colors duration-300"
                >
                  <h3 className="text-xl font-semibold mb-4 text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 mb-6">{item.subtitle}</p>
                  <button className="text-purple-400 hover:text-purple-300 transition-colors flex items-center">
                    Learn more <ArrowRight className="ml-2 w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Job Seekers Love Us */}
        <section className="py-16 bg-dark">
          <div className="container mx-auto px-4" id="features" data-animate>
            <div
              className={`text-center mb-12 transition-all duration-700 ${
                isVisible.features
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                WHY{" "}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Job Seekers
                </span>
                <br />
                Love Us
              </h2>
            </div>

            <div
              className={`grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto transition-all duration-700 delay-200 ${
                isVisible.features
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              {features.map((feature, index) => {
                const IconComponent =
                  typeof feature.icon === "string" ? null : feature.icon;
                return (
                  <div
                    key={index}
                    className={`bg-gradient-to-br ${feature.gradient} bg-dark border border-gray-700 rounded-3xl p-8 shadow-lg hover:transform hover:-translate-y-2 hover:shadow-xl transition-all duration-300`}
                  >
                    <div className="w-16 h-16 bg-dark rounded-2xl flex items-center justify-center mb-6">
                      {IconComponent ? (
                        <IconComponent className="w-8 h-8 text-purple-400" />
                      ) : (
                        <div className="grid grid-cols-2 gap-1">
                          {[...Array(4)].map((_, i) => (
                            <div
                              key={i}
                              className="w-2 h-2 bg-white rounded-full"
                            ></div>
                          ))}
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-dark">
          <div className="container mx-auto px-4" id="faq" data-animate>
            <div
              className={`max-w-4xl mx-auto transition-all duration-700 ${
                isVisible.faq
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Common Questions
                </h2>
                <p className="text-gray-400 text-sm">
                  SOME QUESTIONS PEOPLE USUALLY ASK
                </p>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-dark border border-gray-600 rounded-lg p-6"
                  >
                    <button
                      className="w-full text-left flex justify-between items-center hover:text-purple-400 transition-colors text-white"
                      onClick={() => toggleFaq(index)}
                    >
                      <span className="font-medium">{faq}</span>
                      {openFaq === index ? (
                        <Minus className="text-gray-400 w-5 h-5" />
                      ) : (
                        <Plus className="text-gray-400 w-5 h-5" />
                      )}
                    </button>
                    {openFaq === index && (
                      <div className="mt-4 text-gray-400 animate-fadeIn">
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Sed do eiusmod tempor incididunt ut labore et
                          dolore magna aliqua.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-dark border-t border-gray-800 py-12">
          <div className="container mx-auto px-4" id="footer" data-animate>
            <div
              className={`grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 transition-all duration-700 ${
                isVisible.footer
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src="/assets/logo.png"
                      alt="Nexolve Logo"
                      className="h-8 w-8 object-contain"
                    />
                    <div className="text-xl text-foreground">Nexolve</div>
                  </div>
                </div>
              </div>

              {[
                {
                  title: "For Clients",
                  links: ["Overview", "How it Works", "Secure Pro"],
                },
                {
                  title: "For Talent",
                  links: ["Overview", "Success", "Content"],
                },
                {
                  title: "About Us",
                  links: ["Leadership", "Investor", "Press & News"],
                },
              ].map((section, index) => (
                <div key={index}>
                  <h4 className="font-semibold mb-4 text-white">
                    {section.title}
                  </h4>
                  <ul className="space-y-2 text-gray-400">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <a
                          href="#"
                          className="hover:text-white transition-colors"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 Nexolve Inc. • Privacy Policy • Terms of Service
              </p>
              <div className="flex space-x-4 mt-4 md:mt-0">
                {[Twitter, Facebook, Linkedin, Instagram].map((Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>

        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }
        `}</style>
      </div>
    </Layout>
  );
};

export default NexolvePage;
