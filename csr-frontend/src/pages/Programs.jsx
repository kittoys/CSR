import { useEffect, useState } from "react";
import ProgramCard from "../components/ProgramCard";
import { getPrograms } from "../api/programs";
import "./Programs.css";

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getPrograms();
        setPrograms(data);
      } catch (err) {
        setError("Gagal memuat data program");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="programs-page">
      <header className="programs-page__header">
        <div>
          <p className="eyebrow">Program Kami</p>
          <h2>Daftar program CSR terbaru</h2>
          <p className="muted">
            Telusuri inisiatif yang sedang berjalan dan yang telah selesai.
          </p>
        </div>
      </header>

      {loading && <p>Memuat...</p>}
      {error && <p className="error">{error}</p>}

      <div className="programs-grid">
        {programs.map((program) => (
          <ProgramCard key={program.id} program={program} />
        ))}
        {!loading && !error && programs.length === 0 && (
          <p>Belum ada program.</p>
        )}
      </div>
    </div>
  );
};

export default Programs;
