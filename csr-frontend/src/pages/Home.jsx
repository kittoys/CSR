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
  Leaf,
  Droplets,
  CheckCircle,
  Image,
  Calendar,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";
import { getPrograms } from "../api/programs";
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
      <AchievementsSection />
      <ImpactSection />
      <GallerySection />
      <NewsSection />
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
        <Droplets
          className="absolute text-cyan-400/20 w-8 h-8 animate-float"
          style={{
            top: "20%",
            left: "10%",
            transform: `translate(${mouseParallaxX}px, ${mouseParallaxY}px)`,
          }}
        />
        <Leaf
          className="absolute text-cyan-300/20 w-10 h-10 animate-float-delayed"
          style={{
            top: "70%",
            left: "80%",
            transform: `translate(${-mouseParallaxX}px, ${-mouseParallaxY}px)`,
          }}
        />
        <Droplets
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
          PT Tirta Investama berkomitmen menciptakan dampak positif melalui
          program Corporate Social Responsibility yang berkelanjutan untuk
          masyarakat Indonesia.
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

// Achievements Section
const AchievementsSection = () => {
  const [achievementsRef, isVisible] = useScrollAnimation(0.2);

  const achievements = [
    {
      icon: CheckCircle,
      title: "Konservasi Air",
      stat: "50 Juta Liter",
      description:
        "Air berhasil dikonservasi setiap tahunnya melalui program pengelolaan DAS",
      color: "blue",
    },
    {
      icon: Trees,
      title: "Penghijauan",
      stat: "100.000+ Pohon",
      description: "Pohon ditanam di wilayah tangkapan air dan area resapan",
      color: "emerald",
    },
    {
      icon: Users,
      title: "Pemberdayaan UMKM",
      stat: "500+ UMKM",
      description:
        "Usaha mikro kecil menengah terbantu melalui program pemberdayaan ekonomi",
      color: "purple",
    },
    {
      icon: BookOpen,
      title: "Beasiswa Pendidikan",
      stat: "2.000+ Siswa",
      description:
        "Penerima beasiswa pendidikan dari tingkat SD hingga perguruan tinggi",
      color: "rose",
    },
    {
      icon: Stethoscope,
      title: "Akses Air Bersih",
      stat: "15.000+ Keluarga",
      description:
        "Mendapatkan akses air bersih melalui program WASH (Water, Sanitation, Hygiene)",
      color: "cyan",
    },
    {
      icon: Award,
      title: "Penghargaan",
      stat: "20+ Awards",
      description:
        "Penghargaan nasional dan internasional untuk program keberlanjutan",
      color: "amber",
    },
  ];

  return (
    <section className="achievements-section" id="impact" ref={achievementsRef}>
      <div className="section-header">
        <div className="section-badge">
          <TrendingUp className="w-4 h-4" />
          Dampak & Pencapaian
        </div>
        <h2 className="section-title">Kontribusi Nyata untuk Masyarakat</h2>
        <p className="section-description">
          Pencapaian program CSR AQUA yang terukur dan berkelanjutan dalam
          menciptakan dampak positif bagi lingkungan dan masyarakat
        </p>
      </div>

      <div className="achievements-grid">
        {achievements.map((achievement, index) => (
          <div
            key={index}
            className={`achievement-card ${isVisible ? "visible" : ""}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div
              className={`achievement-icon achievement-icon-${achievement.color}`}
            >
              <achievement.icon className="w-6 h-6" />
            </div>
            <div className="achievement-content">
              <h3 className="achievement-title">{achievement.title}</h3>
              <div className="achievement-stat">{achievement.stat}</div>
              <p className="achievement-description">
                {achievement.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// Gallery Section
const GallerySection = () => {
  const [galleryRef, isVisible] = useScrollAnimation(0.2);

  const galleryItems = [
    {
      image:
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
      title: "Program Penghijauan",
      category: "Lingkungan",
      date: "15 Des 2025",
    },
    {
      image:
        "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80",
      title: "Pelatihan UMKM",
      category: "Ekonomi",
      date: "10 Des 2025",
    },
    {
      image:
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
      title: "Beasiswa Pendidikan",
      category: "Pendidikan",
      date: "5 Des 2025",
    },
    {
      image:
        "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80",
      title: "Penyuluhan Kesehatan",
      category: "Kesehatan",
      date: "1 Des 2025",
    },
    {
      image:
        "https://images.unsplash.com/photo-1473798257550-1e0b36c23753?w=800&q=80",
      title: "Konservasi Mata Air",
      category: "Lingkungan",
      date: "25 Nov 2025",
    },
    {
      image:
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80",
      title: "Workshop Kewirausahaan",
      category: "Ekonomi",
      date: "20 Nov 2025",
    },
  ];

  return (
    <section className="gallery-section" id="gallery" ref={galleryRef}>
      <div className="section-header">
        <div className="section-badge">
          <Image className="w-4 h-4" />
          Galeri Kegiatan
        </div>
        <h2 className="section-title">Dokumentasi Program CSR</h2>
        <p className="section-description">
          Momen-momen berharga dari pelaksanaan program CSR AQUA di berbagai
          wilayah Indonesia
        </p>
      </div>

      <div className="gallery-grid">
        {galleryItems.map((item, index) => (
          <div
            key={index}
            className={`gallery-item ${isVisible ? "visible" : ""}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="gallery-image-wrapper">
              <img
                src={item.image}
                alt={item.title}
                className="gallery-image"
              />
              <div className="gallery-overlay">
                <div className="gallery-overlay-content">
                  <span className="gallery-category">{item.category}</span>
                  <h3 className="gallery-title">{item.title}</h3>
                  <div className="gallery-date">
                    <Calendar className="w-4 h-4" />
                    {item.date}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// News Section
const NewsSection = () => {
  const [newsRef, isVisible] = useScrollAnimation(0.1); // Turunkan threshold dari 0.2 ke 0.1
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const data = await getPrograms();
        console.log("📊 Data programs yang diterima:", data);
        console.log("📝 Jumlah programs:", data?.length);

        // Urutkan program berdasarkan tanggal terbaru (prioritas: created_at)
        // Backend sudah mengirim data sorted by created_at DESC, tapi kita sort ulang untuk memastikan
        const sortedPrograms = [...data].sort((a, b) => {
          // Gunakan created_at sebagai prioritas utama
          const dateA = new Date(a.created_at || a.start_date || 0);
          const dateB = new Date(b.created_at || b.start_date || 0);
          return dateB - dateA; // Terbaru ke terlama
        });

        console.log("🔝 5 program teratas setelah sorting:");
        sortedPrograms.slice(0, 5).forEach((p, i) => {
          console.log(
            `${i + 1}. ID:${p.id} | Created: ${
              p.created_at
            } | Title: ${p.title?.substring(0, 50)}`
          );
        });

        // Ambil 3 program terbaru untuk ditampilkan sebagai news
        const latestPrograms = sortedPrograms.slice(0, 3);
        console.log(
          "✅ 3 program yang akan ditampilkan:",
          latestPrograms.map((p) => ({
            id: p.id,
            title: p.title,
            created_at: p.created_at,
            start_date: p.start_date,
          }))
        );
        setPrograms(latestPrograms);
      } catch (error) {
        console.error("❌ Error fetching programs:", error);
        // Set empty array jika error
        setPrograms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  // Fungsi untuk mendapatkan gambar program
  const getProgramImage = (program) => {
    // Prioritas: gunakan image_url dari database jika ada
    if (program.image_url) {
      return program.image_url;
    }

    // Fallback ke gambar placeholder berdasarkan kategori
    const imageMap = {
      Lingkungan:
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
      Ekonomi:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
      Pendidikan:
        "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80",
      Kesehatan:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
      default:
        "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80",
    };
    return imageMap[program.category_name] || imageMap.default;
  };

  // Fungsi untuk format tanggal
  const formatDate = (dateString) => {
    if (!dateString) return "Baru-baru ini";
    try {
      const date = new Date(dateString);
      // Cek jika tanggal valid
      if (isNaN(date.getTime())) return "Baru-baru ini";

      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch (error) {
      return "Baru-baru ini";
    }
  };

  // Fungsi untuk estimasi waktu baca
  const getReadTime = (description) => {
    if (!description) return "3 min";
    const words = description.split(" ").length;
    const readTime = Math.ceil(words / 200); // Asumsi 200 kata per menit
    return `${readTime} min`;
  };

  // Fungsi untuk mendapatkan tanggal terbaru
  const getLatestDate = (program) => {
    // Prioritas: created_at > start_date > fallback
    return program.created_at || program.start_date || new Date().toISOString();
  };

  return (
    <section className="news-section" id="news" ref={newsRef}>
      <div className="section-header">
        <div className="section-badge">
          <BookOpen className="w-4 h-4" />
          Berita & Artikel
        </div>
        <h2 className="section-title">Update Terbaru Program CSR</h2>
        <p className="section-description">
          Informasi terkini tentang program, pencapaian, dan kegiatan CSR AQUA
        </p>
      </div>

      {loading ? (
        <div className="news-loading">
          <div className="loading-spinner"></div>
          <p>Memuat berita terbaru...</p>
        </div>
      ) : (
        <>
          <div className="news-grid">
            {programs.map((program, index) => (
              <div
                key={program.id}
                className={`news-card ${isVisible ? "visible" : ""}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="news-image-wrapper">
                  <img
                    src={getProgramImage(program)}
                    alt={program.title}
                    className="news-image"
                  />
                  <span className="news-category">
                    {program.category_name || "Program CSR"}
                  </span>
                </div>
                <div className="news-content">
                  <h3 className="news-title">{program.title}</h3>
                  <p className="news-excerpt">
                    {program.description ||
                      "Program CSR AQUA yang berkelanjutan untuk masyarakat Indonesia."}
                  </p>
                  <div className="news-meta">
                    <div className="news-date">
                      <Calendar className="w-4 h-4" />
                      {formatDate(getLatestDate(program))}
                    </div>
                    <span className="news-divider">•</span>
                    <div className="news-read-time">
                      {getReadTime(program.description)} baca
                    </div>
                  </div>
                  <button
                    className="news-read-more"
                    onClick={() =>
                      (window.location.href = `/programs/${program.id}`)
                    }
                  >
                    Baca Selengkapnya
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="news-cta">
            <button
              className="btn-view-all"
              onClick={() => (window.location.href = "/programs")}
            >
              Lihat Semua Program
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </div>
        </>
      )}
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
      info: "Jl. Raya Sukabumi, Ds. Mekarsari, Kec. Cicurug, Kab. Sukabumi, Jawa Barat 43359",
    },
    {
      icon: Mail,
      title: "Email",
      info: "csr@aqua.co.id",
    },
    {
      icon: Phone,
      title: "Telepon",
      info: "+62 89518074279",
    },
    {
      icon: Clock,
      title: "Jam Operasional",
      info: "Senin - Jumat: 08:00 - 15:00 WIB",
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
            <h3 className="footer-brand-title">AQUA Mekarsari</h3>
            <p className="footer-brand-text">
              Berkomitmen untuk menjaga kelestarian air dan lingkungan sejak
              1993. Bersama masyarakat, kami membangun masa depan berkelanjutan.
            </p>
            <div
              className="footer-contact-list"
              style={{ marginTop: "var(--space-6)" }}
            >
              <div className="footer-contact-item">
                <Phone className="w-4 h-4" />
                <span>+62 21 8231 8888</span>
              </div>
              <div className="footer-contact-item">
                <Mail className="w-4 h-4" />
                <span>csr.mekarsari@aqua.co.id</span>
              </div>
              <div className="footer-contact-item">
                <MapPin className="w-4 h-4" />
                <span>Jl. Raya Mekarsari No. 1, Cileungsi, Bogor</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h4 className="footer-links-title">Tautan Cepat</h4>
            <ul className="footer-links-list">
              <li>
                <a href="#about" className="footer-link">
                  Tentang CSR
                </a>
              </li>
              <li>
                <a href="#programs" className="footer-link">
                  Program Kami
                </a>
              </li>
              <li>
                <a href="#impact" className="footer-link">
                  Dampak & Pencapaian
                </a>
              </li>
              <li>
                <a href="#gallery" className="footer-link">
                  Galeri Kegiatan
                </a>
              </li>
              <li>
                <a href="#news" className="footer-link">
                  Berita & Artikel
                </a>
              </li>
              <li>
                <a href="#report" className="footer-link">
                  Laporan Keberlanjutan
                </a>
              </li>
            </ul>
          </div>

          {/* CSR Programs */}
          <div className="footer-links">
            <h4 className="footer-links-title">Program CSR</h4>
            <ul className="footer-links-list">
              <li>
                <a href="programs" className="footer-link">
                  Lingkungan
                </a>
              </li>
              <li>
                <a href="programs" className="footer-link">
                  Ekonomi
                </a>
              </li>
              <li>
                <a href="programs" className="footer-link">
                  Pendidikan
                </a>
              </li>
              <li>
                <a href="programs  " className="footer-link">
                  Kesehatan
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="footer-social-section">
            <h4 className="footer-links-title">Ikuti Kami</h4>
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
        </div>

        {/* Awards Section */}
        <div className="footer-awards">
          <div className="footer-award-badge">
            <Award className="w-6 h-6" />
          </div>
          <div className="footer-award-content">
            <h4 className="footer-award-title">Penghargaan</h4>
            <p className="footer-award-text">
              ISO 14001, Green Industry Award, CSR Excellence 2024
            </p>
          </div>
        </div>

        {/* Certifications */}
        <div className="footer-certifications">
          <h4 className="footer-cert-title">Sertifikasi & Kemitraan</h4>
          <div className="footer-cert-badges">
            <div className="footer-cert-badge">ISO 14001</div>
            <div className="footer-cert-badge">PROPER</div>
            <div className="footer-cert-badge">SDGs</div>
            <div className="footer-cert-badge">FSC</div>
            <div className="footer-cert-badge">B Corp</div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>&copy; 2026 AQUA Mekarsari. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#privacy" className="footer-bottom-link">
              Kebijakan Privasi
            </a>
            <span className="footer-divider">|</span>
            <a href="#terms" className="footer-bottom-link">
              Syarat & Ketentuan
            </a>
          </div>
          <p className="footer-tagline">
            Dibuat dengan{" "}
            <Heart className="w-4 h-4 inline" style={{ color: "#f43f5e" }} />{" "}
            untuk bumi yang berkelanjutan
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Home;
