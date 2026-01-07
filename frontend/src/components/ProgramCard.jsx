import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowRight, Clock } from "lucide-react";
import "./ProgramCard.css";

const ProgramCard = ({ program, index = 0 }) => {
  const resolveImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("/uploads")) return `http://localhost:5000${url}`;
    return url;
  };

  const {
    id,
    title,
    description,
    category_name,
    location,
    start_date,
    end_date,
    status,
    image_url,
    source_link,
  } = program;

  const imageUrl =
    resolveImageUrl(image_url) ||
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80";

  const getStatusConfig = (status) => {
    const configs = {
      planned: {
        label: "Direncanakan",
        color: "#3b82f6",
        bg: "rgba(59, 130, 246, 0.1)",
      },
      ongoing: {
        label: "Berlangsung",
        color: "#10b981",
        bg: "rgba(16, 185, 129, 0.1)",
      },
      completed: {
        label: "Selesai",
        color: "#64748b",
        bg: "rgba(100, 116, 139, 0.1)",
      },
    };
    return configs[status] || configs.planned;
  };

  const statusConfig = getStatusConfig(status);

  return (
    <motion.article
      className="program-card"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
    >
      <Link to={`/programs/${id}`} className="program-card__link">
        <div className="program-card__image-container">
          <motion.div
            className="program-card__image"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4 }}
          >
            <img src={imageUrl} alt={title} loading="lazy" />
          </motion.div>

          <div className="program-card__overlay">
            <motion.div
              className="program-card__overlay-content"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowRight size={32} />
              <span>Lihat Detail</span>
            </motion.div>
          </div>
        </div>

        <div className="program-card__content">
          <div className="program-card__header">
            <span className="program-card__category">
              {category_name || "Umum"}
            </span>
            <span
              className="program-card__status"
              style={{
                backgroundColor: statusConfig.bg,
                color: statusConfig.color,
              }}
            >
              <Clock size={14} />
              {statusConfig.label}
            </span>
          </div>

          <h3 className="program-card__title">{title}</h3>

          <p className="program-card__description">
            {description?.length > 120
              ? `${description.substring(0, 120)}...`
              : description}
          </p>

          <div className="program-card__meta">
            <div className="program-card__meta-item">
              <MapPin size={16} />
              <span>{location || "Lokasi TBD"}</span>
            </div>
            <div className="program-card__meta-item">
              <Calendar size={16} />
              <span>
                {start_date
                  ? new Date(start_date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "TBD"}
                {" – "}
                {end_date
                  ? new Date(end_date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "TBD"}
              </span>
            </div>
          </div>

          {source_link && (
            <div className="program-card__source">
              <a
                href={source_link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="program-card__source-link"
              >
                📰 Sumber Berita
              </a>
            </div>
          )}

          <motion.div
            className="program-card__cta"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            <span>Selengkapnya</span>
            <ArrowRight size={18} />
          </motion.div>
        </div>

        <div className="program-card__shine"></div>
      </Link>
    </motion.article>
  );
};

export default ProgramCard;
