import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProgram } from "../api/programs";
import "./ProgramDetail.css";

const ProgramDetail = () => {
  const { id } = useParams();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getProgram(id);
        setProgram(data);
      } catch (err) {
        setError("Gagal memuat detail program");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <p className="page">Memuat...</p>;
  if (error) return <p className="page error">{error}</p>;
  if (!program) return <p className="page">Program tidak ditemukan.</p>;

  const {
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
    <div className="page">
      <Link to="/programs" className="back-link">
        ← Kembali
      </Link>
      <div className="program-detail__image">
        <img src={imageUrl} alt={title} />
      </div>
      <p className="eyebrow">{category_name || "Uncategorized"}</p>
      <h2>{title}</h2>
      <p className="status">Status: {status || "planned"}</p>
      <p className="muted">Lokasi: {location || "TBD"}</p>
      <p className="muted">
        Jadwal: {start_date ? new Date(start_date).toLocaleDateString() : "TBD"}{" "}
        - {end_date ? new Date(end_date).toLocaleDateString() : "TBD"}
      </p>
      <p className="detail-desc">{description}</p>
    </div>
  );
};

export default ProgramDetail;
