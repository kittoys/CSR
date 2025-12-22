import { Link } from "react-router-dom";
import "./ProgramCard.css";

const ProgramCard = ({ program }) => {
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
  } = program;

  const imageUrl =
    image_url ||
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80";

  return (
    <article className="program-card">
      <div className="program-card__image">
        <img src={imageUrl} alt={title} />
      </div>
      <div className="program-card__header">
        <p className="program-card__tag">{category_name || "Uncategorized"}</p>
        <p
          className={`program-card__status program-card__status--${
            status || "planned"
          }`}
        >
          {status || "planned"}
        </p>
      </div>
      <h3 className="program-card__title">{title}</h3>
      <p className="program-card__desc">{description}</p>
      <div className="program-card__meta">
        <span>{location || "TBD"}</span>
        <span>
          {start_date ? new Date(start_date).toLocaleDateString() : "TBD"} –{" "}
          {end_date ? new Date(end_date).toLocaleDateString() : "TBD"}
        </span>
      </div>
      <div className="program-card__actions">
        <Link to={`/programs/${id}`} className="program-card__link">
          View details
        </Link>
      </div>
    </article>
  );
};

export default ProgramCard;
