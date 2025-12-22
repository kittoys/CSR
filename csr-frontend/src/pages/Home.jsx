import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home">
      <section className="home__hero">
        <div>
          <p className="home__eyebrow">Corporate Social Responsibility</p>
          <h1>Empower communities through impactful programs</h1>
          <p className="home__lead">
            Jelajahi inisiatif CSR kami dan lihat bagaimana kolaborasi bisa
            membawa perubahan nyata untuk masyarakat dan lingkungan.
          </p>
          <div className="home__actions">
            <Link to="/programs" className="btn btn--primary">
              Lihat Program
            </Link>
            <Link to="/admin" className="btn btn--ghost">
              Admin Dashboard
            </Link>
          </div>
        </div>
        <div className="home__card">
          <p className="home__card-title">Fokus Dampak</p>
          <ul>
            <li>Lingkungan berkelanjutan</li>
            <li>Pemberdayaan pendidikan</li>
            <li>Kesejahteraan masyarakat</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Home;
