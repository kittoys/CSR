import React, { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  Cog,
  Trees,
  Briefcase,
  BookOpen,
  Stethoscope,
  Target,
  Users,
  MapPin,
  Mail,
  Phone,
  Clock,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Linkedin as LinkedinIcon,
  Sparkles,
  TrendingUp,
  Award,
  Heart,
} from "lucide-react";
import "./Home.css";

// Custom hook for scroll-triggered animations
const useScrollAnimation = (threshold = 0.2) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const currentElement = elementRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          // Unobserve after animation triggers for performance
          if (currentElement) {
            observer.unobserve(currentElement);
          }
        }
      },
      { threshold }
    );

    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold, isVisible]);

  return [elementRef, isVisible];
};

const Home = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Smooth scroll to section handler
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-600 via-white to-sky-50">
      <HeroSection
        mousePosition={mousePosition}
        scrollY={scrollY}
        scrollToSection={scrollToSection}
      />
      <StatsSection />
      <FocusSection />
      <AboutSection />
      <ImpactSection />
      <ContactSection />
      <FooterSection />
    </div>
  );
};

// Hero Section with parallax effect and floating icons
const HeroSection = ({ mousePosition, scrollY, scrollToSection }) => {
  const parallaxY = scrollY * 0.5;
  const mouseParallaxX = (mousePosition.x - window.innerWidth / 2) * 0.02;
  const mouseParallaxY = (mousePosition.y - window.innerHeight / 2) * 0.02;

  // Fade out effect calculation
  const fadeDistance = 400; // Distance to complete fade (in pixels)
  const fadeOpacity = Math.max(0, 1 - scrollY / fadeDistance);
  const fadeTranslateY = parallaxY - scrollY * 0.3; // Slide up while fading

  return (
    <section className="hero-section relative overflow-hidden">
      {/* Background floating icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Sparkles
          className="absolute text-cyan-400/20 w-8 h-8 animate-float"
          style={{
            top: "20%",
            left: "10%",
            transform: `translate(${mouseParallaxX}px, ${mouseParallaxY}px)`,
          }}
        />
        <Heart
          className="absolute text-cyan-300/20 w-10 h-10 animate-float-delayed"
          style={{
            top: "70%",
            left: "80%",
            transform: `translate(${-mouseParallaxX}px, ${-mouseParallaxY}px)`,
          }}
        />
        <Target
          className="absolute text-cyan-500/20 w-12 h-12 animate-float"
          style={{
            top: "40%",
            right: "15%",
            transform: `translate(${mouseParallaxX * 1.5}px, ${
              mouseParallaxY * 1.5
            }px)`,
          }}
        />
      </div>

      <div
        className="hero-content"
        style={{
          transform: `translateY(${fadeTranslateY}px)`,
          opacity: fadeOpacity,
          transition: "opacity 0.1s ease-out, transform 0.1s ease-out",
        }}
      >
        <div className="badge-container">
          <span className="badge-text">
            <Sparkles className="w-4 h-4" />
            Program CSR Berkelanjutan
          </span>
        </div>

        <h1 className="hero-title">
          Bersama Membangun <br />
          <span className="text-gradient">Masa Depan Lebih Baik</span>
        </h1>

        <p className="hero-description">
          PT. AQUA Golden Mississippi berkomitmen menciptakan dampak positif
          melalui program Corporate Social Responsibility yang berkelanjutan
          untuk masyarakat Indonesia.
        </p>

        <div className="cta-buttons">
          <button
            className="btn-primary"
            onClick={() => scrollToSection("programs")}
          >
            Jelajahi Program
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            className="btn-secondary"
            onClick={() => scrollToSection("about")}
          >
            Tentang Kami
          </button>
        </div>
      </div>
    </section>
  );
};

// Stats Section with animated counters
const StatsSection = () => {
  const [statsRef, isVisible] = useScrollAnimation(0.3);
  const [counts, setCounts] = useState({
    programs: 0,
    people: 0,
    cities: 0,
  });

  useEffect(() => {
    if (isVisible) {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const stepDuration = duration / steps;

      const targets = {
        programs: 50,
        people: 10000,
        cities: 25,
      };

      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;

        setCounts({
          programs: Math.floor(targets.programs * progress),
          people: Math.floor(targets.people * progress),
          cities: Math.floor(targets.cities * progress),
        });

        if (currentStep >= steps) {
          clearInterval(timer);
          setCounts(targets);
        }
      }, stepDuration);

      return () => clearInterval(timer);
    }
  }, [isVisible]);

  return (
    <section className="stats-section" ref={statsRef}>
      <div className="stats-container">
        <div className={`stats-card ${isVisible ? "visible" : ""}`}>
          <div className="stats-icon">
            <Target className="w-8 h-8" />
          </div>
          <div className="stats-number">{counts.programs}+</div>
          <div className="stats-label">Program Aktif</div>
        </div>

        <div
          className={`stats-card ${isVisible ? "visible" : ""}`}
          style={{ animationDelay: "0.1s" }}
        >
          <div className="stats-icon">
            <Users className="w-8 h-8" />
          </div>
          <div className="stats-number">{counts.people.toLocaleString()}+</div>
          <div className="stats-label">Masyarakat Terbantu</div>
        </div>

        <div
          className={`stats-card ${isVisible ? "visible" : ""}`}
          style={{ animationDelay: "0.2s" }}
        >
          <div className="stats-icon">
            <MapPin className="w-8 h-8" />
          </div>
          <div className="stats-number">{counts.cities}+</div>
          <div className="stats-label">Kota & Kabupaten</div>
        </div>
      </div>
    </section>
  );
};

// Focus Section - 4 main areas
const FocusSection = () => {
  const [focusRef, isVisible] = useScrollAnimation(0.2);

  const focusAreas = [
    {
      icon: Trees,
      title: "Lingkungan",
      description:
        "Program pelestarian lingkungan, konservasi air, dan penghijauan",
      color: "emerald",
    },
    {
      icon: Briefcase,
      title: "Ekonomi",
      description: "Pemberdayaan ekonomi masyarakat dan UMKM lokal",
      color: "blue",
    },
    {
      icon: BookOpen,
      title: "Pendidikan",
      description:
        "Peningkatan akses pendidikan dan beasiswa untuk generasi muda",
      color: "purple",
    },
    {
      icon: Stethoscope,
      title: "Kesehatan",
      description: "Program kesehatan masyarakat dan akses air bersih",
      color: "rose",
    },
  ];

  return (
    <section className="focus-section" id="programs" ref={focusRef}>
      <div className="section-header">
        <div className="section-badge">
          <Cog className="w-4 h-4" />
          Area Fokus
        </div>
        <h2 className="section-title">Program Unggulan Kami</h2>
        <p className="section-description">
          Empat pilar utama yang menjadi fokus program CSR AQUA dalam
          menciptakan dampak positif bagi masyarakat
        </p>
      </div>

      <div className="focus-grid">
        {focusAreas.map((area, index) => (
          <div
            key={index}
            className={`focus-card ${isVisible ? "visible" : ""}`}
            style={{ animationDelay: `${index * 0.1}s`, cursor: "pointer" }}
            onClick={() => (window.location.href = "/programs")}
          >
            <div className={`focus-icon focus-icon-${area.color}`}>
              <area.icon className="w-6 h-6" />
            </div>
            <h3 className="focus-title">{area.title}</h3>
            <p className="focus-description">{area.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

// About Section
const AboutSection = () => {
  const [aboutRef, isVisible] = useScrollAnimation(0.2);

  return (
    <section className="about-section" id="about" ref={aboutRef}>
      <div className="about-grid">
        <div className={`about-content ${isVisible ? "visible" : ""}`}>
          <div className="section-badge">
            <Heart className="w-4 h-4" />
            Tentang CSR AQUA
          </div>
          <h2 className="section-title">Komitmen Kami untuk Indonesia</h2>
          <p className="about-text">
            Sejak tahun 1973, AQUA telah menjadi bagian dari kehidupan
            masyarakat Indonesia. Kami percaya bahwa bisnis yang berkelanjutan
            harus memberikan dampak positif bagi lingkungan dan masyarakat.
          </p>
          <p className="about-text">
            Program CSR kami dirancang untuk menciptakan nilai bersama, tidak
            hanya bagi perusahaan tetapi juga untuk komunitas di sekitar wilayah
            operasional kami.
          </p>

          <div className="about-stats">
            <div className="about-stat-item">
              <div className="about-stat-number">50+</div>
              <div className="about-stat-label">Tahun Pengalaman</div>
            </div>
            <div className="about-stat-item">
              <div className="about-stat-number">10K+</div>
              <div className="about-stat-label">Keluarga Terbantu</div>
            </div>
            <div className="about-stat-item">
              <div className="about-stat-number">25+</div>
              <div className="about-stat-label">Wilayah Jangkauan</div>
            </div>
          </div>
        </div>

        <div
          className={`about-visual ${isVisible ? "visible" : ""}`}
          style={{ animationDelay: "0.2s" }}
        >
          <div className="about-card">
            <div className="about-card-icon">
              <Target className="w-8 h-8" />
            </div>
            <h3 className="about-card-title">Visi Berkelanjutan</h3>
            <p className="about-card-text">
              Menciptakan dampak positif jangka panjang untuk generasi mendatang
            </p>
          </div>

          <div className="about-card">
            <div className="about-card-icon">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="about-card-title">Pemberdayaan Lokal</h3>
            <p className="about-card-text">
              Mengembangkan kapasitas masyarakat lokal melalui program
              terstruktur
            </p>
          </div>

          <div className="about-card">
            <div className="about-card-icon">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="about-card-title">Nilai Bersama</h3>
            <p className="about-card-text">
              Menciptakan nilai ekonomi, sosial, dan lingkungan secara bersamaan
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// Impact Section
const ImpactSection = () => {
  const [impactRef, isVisible] = useScrollAnimation(0.2);

  const impacts = [
    {
      icon: TrendingUp,
      percentage: "95%",
      label: "Tingkat Kepuasan",
      description: "Masyarakat penerima manfaat program",
    },
    {
      icon: Award,
      percentage: "15+",
      label: "Penghargaan",
      description: "Nasional dan internasional",
    },
    {
      icon: Heart,
      percentage: "98%",
      label: "Tingkat Kepercayaan",
      description: "Dari stakeholder dan mitra",
    },
  ];

  return (
    <section className="impact-section" ref={impactRef}>
      <div className="section-header">
        <div className="section-badge">
          <Award className="w-4 h-4" />
          Dampak Nyata
        </div>
        <h2 className="section-title">Hasil yang Terukur</h2>
        <p className="section-description">
          Komitmen kami tercermin dalam angka dan pencapaian yang nyata
        </p>
      </div>

      <div className="impact-grid">
        {impacts.map((impact, index) => (
          <div
            key={index}
            className={`impact-card ${isVisible ? "visible" : ""}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="impact-icon">
              <impact.icon className="w-8 h-8" />
            </div>
            <div className="impact-percentage">{impact.percentage}</div>
            <div className="impact-label">{impact.label}</div>
            <div className="impact-description">{impact.description}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

// Contact Section
const ContactSection = () => {
  const [contactRef, isVisible] = useScrollAnimation(0.2);

  const contactInfo = [
    {
      icon: MapPin,
      title: "Alamat Kantor",
      info: "Jl. Pulo Lentut No. 3, Kawasan Industri Pulo Gadung, Jakarta Timur 13920",
    },
    {
      icon: Mail,
      title: "Email",
      info: "csr@aqua.co.id",
    },
    {
      icon: Phone,
      title: "Telepon",
      info: "(021) 460-8989",
    },
    {
      icon: Clock,
      title: "Jam Operasional",
      info: "Senin - Jumat: 08:00 - 17:00 WIB",
    },
  ];

  return (
    <section className="contact-section" id="contact" ref={contactRef}>
      <div className="section-header">
        <div className="section-badge">
          <Phone className="w-4 h-4" />
          Hubungi Kami
        </div>
        <h2 className="section-title">Mari Berkolaborasi</h2>
        <p className="section-description">
          Tertarik untuk bermitra atau mengetahui lebih lanjut tentang program
          CSR kami? Hubungi kami
        </p>
      </div>

      <div className="contact-grid">
        {contactInfo.map((contact, index) => (
          <div
            key={index}
            className={`contact-card ${isVisible ? "visible" : ""}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="contact-icon">
              <contact.icon className="w-6 h-6" />
            </div>
            <h3 className="contact-title">{contact.title}</h3>
            <p className="contact-info">{contact.info}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

// Footer Section
const FooterSection = () => {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <h3 className="footer-brand-title">CSR AQUA</h3>
            <p className="footer-brand-text">
              Berkomitmen untuk menciptakan dampak positif melalui program CSR
              yang berkelanjutan untuk masyarakat Indonesia.
            </p>
            <div className="footer-social">
              <button className="footer-social-link" aria-label="Facebook">
                <FacebookIcon className="w-5 h-5" />
              </button>
              <button className="footer-social-link" aria-label="Instagram">
                <InstagramIcon className="w-5 h-5" />
              </button>
              <button className="footer-social-link" aria-label="LinkedIn">
                <LinkedinIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h4 className="footer-links-title">Tautan Cepat</h4>
            <ul className="footer-links-list">
              <li>
                <a href="#programs" className="footer-link">
                  Program
                </a>
              </li>
              <li>
                <a href="#about" className="footer-link">
                  Tentang Kami
                </a>
              </li>
              <li>
                <a href="#contact" className="footer-link">
                  Hubungi Kami
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-contact">
            <h4 className="footer-links-title">Kontak</h4>
            <ul className="footer-contact-list">
              <li className="footer-contact-item">
                <Mail className="w-4 h-4" />
                <span>csr@aqua.co.id</span>
              </li>
              <li className="footer-contact-item">
                <Phone className="w-4 h-4" />
                <span>(021) 460-8989</span>
              </li>
              <li className="footer-contact-item">
                <MapPin className="w-4 h-4" />
                <span>Jakarta, Indonesia</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>&copy; 2024 CSR AQUA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Home;
