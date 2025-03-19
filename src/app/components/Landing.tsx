// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import SignIN from "./SignIn";
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faGraduationCap,
  faBuilding,
  faBook,
  faEnvelope,
  faBars,
  faSignInAlt,
  faFileAlt,
  faComments,
  faLaptopCode,

} from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faLinkedinIn, faXTwitter, faFacebookF, } from '@fortawesome/free-brands-svg-icons';


const Landing: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [placementStats, setPlacementStats] = useState({
    studentsPlaced: 0,
    companies: 0,
    averagePackage: 0
  });

  const homeRef = useRef<HTMLElement>(null!);
  const placementsRef = useRef<HTMLElement>(null!);
  const companiesRef = useRef<HTMLElement>(null!);
  const resourcesRef = useRef<HTMLElement>(null!);
  const contactRef = useRef<HTMLElement>(null!);

  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setPlacementStats(prev => ({
        studentsPlaced: prev.studentsPlaced < 1200 ? prev.studentsPlaced + 12 : 1200,
        companies: prev.companies < 150 ? prev.companies + 2 : 150,
        averagePackage: prev.averagePackage < 85 ? prev.averagePackage + 1 : 85
      }));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="https://public.readdy.ai/ai/img_res/1a4235277774dee138e6c11fb4daa1da.jpg"
              alt="CareerCompass Logo"
              className="h-10"
            />
            <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              CareerCompass
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection(homeRef)}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 flex items-center gap-2 cursor-pointer"
            >
              <FontAwesomeIcon icon={faHome} className="text-blue-500 w-5 h-5" />
              <span className="font-medium">Home</span>
            </button>
            <button
              onClick={() => scrollToSection(placementsRef)}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 flex items-center gap-2 cursor-pointer"
            >
              <FontAwesomeIcon icon={faGraduationCap} className="text-blue-500 w-5 h-5" />
              <span className="font-medium">Placements</span>
            </button>
            <button
              onClick={() => scrollToSection(companiesRef)}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 flex items-center gap-2 cursor-pointer"
            >
              <FontAwesomeIcon icon={faBuilding} className="text-blue-500 w-5 h-5" />
              <span className="font-medium">Companies</span>
            </button>
            <button
              onClick={() => scrollToSection(resourcesRef)}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 flex items-center gap-2 cursor-pointer"
            >
              <FontAwesomeIcon icon={faBook} className="text-blue-500 w-5 h-5" />
              <span className="font-medium">Resources</span>
            </button>
            <button
              onClick={() => scrollToSection(contactRef)}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 flex items-center gap-2 cursor-pointer"
            >
              <FontAwesomeIcon icon={faEnvelope} className="text-blue-500 w-5 h-5" />
              <span className="font-medium">Contact</span>
            </button>
            <Link href="/SignIn">
              <Button className="!rounded-button whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                <FontAwesomeIcon icon={faSignInAlt} className="w-5 h-5" />
                <span>Login</span>
              </Button>
              </Link>
          </nav>
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <FontAwesomeIcon icon={faBars} className="text-xl" />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed top-16 left-0 right-0 bg-white shadow-lg md:hidden z-40">
          <nav className="flex flex-col p-4">
            <button onClick={() => scrollToSection(homeRef)} className="py-2 text-gray-700 hover:text-blue-600 cursor-pointer">Home</button>
            <button onClick={() => scrollToSection(placementsRef)} className="py-2 text-gray-700 hover:text-blue-600 cursor-pointer">Placements</button>
            <button onClick={() => scrollToSection(companiesRef)} className="py-2 text-gray-700 hover:text-blue-600 cursor-pointer">Companies</button>
            <button onClick={() => scrollToSection(resourcesRef)} className="py-2 text-gray-700 hover:text-blue-600 cursor-pointer">Resources</button>
            <button onClick={() => scrollToSection(contactRef)} className="py-2 text-gray-700 hover:text-blue-600 cursor-pointer">Contact</button>
            <Button className="mt-2 !rounded-button whitespace-nowrap">Login</Button>
          </nav>
        </div>
      )}

      {/* Home Section */}
      <section ref={homeRef} className="pt-16 relative h-[600px] flex items-center">
        <div className="absolute inset-0">
          <img
            src="https://public.readdy.ai/ai/img_res/48cefc01fc9a25254e1c56e5e350c63c.jpg"
            alt="Campus Placement"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-900/40"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl font-bold mb-6">Shape Your Career Path With Campus Placements</h1>
            <p className="text-xl mb-8">Join thousands of successful graduates who launched their careers through our platform. Your dream job awaits!</p>
            <div className="flex space-x-4">
              <Button className="!rounded-button whitespace-nowrap text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700 cursor-pointer">Browse Opportunities</Button>
              <Button variant="outline" className="!rounded-button whitespace-nowrap text-lg px-8 py-6 bg-white text-blue-900 hover:bg-blue-50 cursor-pointer">Register Now</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-4xl font-bold text-blue-600 mb-2">{placementStats.studentsPlaced}+</h3>
              <p className="text-gray-600">Students Placed</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-4xl font-bold text-blue-600 mb-2">{placementStats.companies}+</h3>
              <p className="text-gray-600">Partner Companies</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-4xl font-bold text-blue-600 mb-2">${placementStats.averagePackage}K+</h3>
              <p className="text-gray-600">Average Package</p>
            </div>
          </div>
        </div>
      </section>

      {/* Placements Section */}
      <section ref={placementsRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Latest Placements</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                company: "Microsoft",
                role: "Software Engineer",
                package: "120K",
                location: "Seattle, WA",
                logo: "https://public.readdy.ai/ai/img_res/0934316c20ec326842acfcb2c6f2f298.jpg"
              },
              {
                company: "Amazon",
                role: "Product Manager",
                package: "135K",
                location: "New York, NY",
                logo: "https://public.readdy.ai/ai/img_res/46435149eedba49e7c315da2cc9253c5.jpg"
              },
              {
                company: "Google",
                role: "Data Scientist",
                package: "140K",
                location: "Mountain View, CA",
                logo: "https://public.readdy.ai/ai/img_res/18c00652037a23208c6b721d9c4c41bb.jpg"
              }
            ].map((placement, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <img src={placement.logo} alt={placement.company} className="w-12 h-12 object-contain" />
                  <div className="ml-4">
                    <h3 className="font-semibold text-lg">{placement.company}</h3>
                    <p className="text-gray-600">{placement.location}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-blue-600 font-medium">{placement.role}</p>
                  <p className="text-gray-600">Package: ${placement.package}/year</p>
                  <Button className="w-full !rounded-button whitespace-nowrap mt-4">Apply Now</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section ref={companiesRef} className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Our Partner Companies</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                name: "Apple",
                logo: "https://public.readdy.ai/ai/img_res/793795e5d47b8593af99d5ec224034cf.jpg"
              },
              {
                name: "Meta",
                logo: "https://public.readdy.ai/ai/img_res/3870d7c7e5819aab92730ae2b0dedc02.jpg"
              },
              {
                name: "Netflix",
                logo: "https://public.readdy.ai/ai/img_res/1729314eea4f0c4eadfb1f90df973e6a.jpg"
              },
              {
                name: "Tesla",
                logo: "https://public.readdy.ai/ai/img_res/fe732eb6b8145b20e809a3a4173245b6.jpg"
              }
            ].map((company, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <img src={company.logo} alt={company.name} className="w-full h-20 object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section ref={resourcesRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Career Resources</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Resume Building",
                description: "Learn how to create an impactful resume that stands out to recruiters.",
                icon: faFileAlt
              },
              {
                title: "Interview Preparation",
                description: "Master the art of interviewing with our comprehensive guides and mock interviews.",
                icon: faComments
              },
              {
                title: "Skill Development",
                description: "Access curated learning resources to enhance your technical and soft skills.",
                icon: faLaptopCode
              }
            ].map((resource, index) => (
              <Card key={index} className="p-8 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <FontAwesomeIcon
                    icon={resource.icon}
                    className="text-2xl text-blue-600"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-4">{resource.title}</h3>
                <p className="text-gray-600 mb-6">{resource.description}</p>
                <Button className="!rounded-button whitespace-nowrap w-full">
                  Learn More
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section ref={contactRef} className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Get in Touch</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <i className="fas fa-map-marker-alt text-blue-600 w-8"></i>
                  <p>123 University Ave, CA 94301</p>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-phone text-blue-600 w-8"></i>
                  <p>+1 (555) 123-4567</p>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-envelope text-blue-600 w-8"></i>
                  <p>contact@careercompass.com</p>
                </div>
              </div>
              <div className="mt-8">
                <h4 className="font-semibold mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                    <FontAwesomeIcon icon={faFacebookF} />
                  </a>
                  <a href="#" className="w-10 h-10 bg-blue-400 text-white rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
                    <FontAwesomeIcon icon={faLinkedinIn} />
                  </a>
                  <a href="#" className="w-10 h-10 bg-blue-800 text-white rounded-full flex items-center justify-center hover:bg-blue-900 transition-colors">
                    <FontAwesomeIcon icon={faInstagram} />
                  </a>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-2xl font-semibold mb-6">Send us a Message</h3>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input type="email" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea rows={4} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
                </div>
                <Button className="!rounded-button whitespace-nowrap w-full">Send Message</Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">About Us</h3>
              <p className="text-gray-400">Connecting talented students with leading companies for successful career placements.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><button onClick={() => scrollToSection(homeRef)} className="text-gray-400 hover:text-white cursor-pointer">Home</button></li>
                <li><button onClick={() => scrollToSection(placementsRef)} className="text-gray-400 hover:text-white cursor-pointer">Placements</button></li>
                <li><button onClick={() => scrollToSection(companiesRef)} className="text-gray-400 hover:text-white cursor-pointer">Companies</button></li>
                <li><button onClick={() => scrollToSection(resourcesRef)} className="text-gray-400 hover:text-white cursor-pointer">Resources</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li><i className="fas fa-envelope mr-2"></i> contact@careercompass.com</li>
                <li><i className="fas fa-phone mr-2"></i> +1 (555) 123-4567</li>
                <li><i className="fas fa-map-marker-alt mr-2"></i> 123 University Ave, CA 94301</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white text-xl cursor-pointer">
                  <FontAwesomeIcon icon={faLinkedinIn} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white text-xl cursor-pointer">
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white text-xl cursor-pointer">
                  <FontAwesomeIcon icon={faFacebookF} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white text-xl cursor-pointer">
                  <FontAwesomeIcon icon={faXTwitter} />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 CareerCompass. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;

