import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useNavigate } from "react-router-dom";

function AdminLayout({ children }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/admin/login");
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  return (
    <div className="admin-page">

      <aside className="admin-sidebar">

        <div className="admin-sidebar-logo">
          Z<span>TECH</span>
        </div>

        <div className="admin-sidebar-label">
          MANAGEMENT
        </div>

        <nav className="admin-sidebar-nav">

          <a href="/admin" className="admin-nav-link">
            <span>01</span>
            Dashboard
          </a>

          <a href="/admin/projects" className="admin-nav-link">
            <span>02</span>
            Projects
          </a>

          <a href="/admin/services" className="admin-nav-link">
            <span>03</span>
            Services
          </a>

          <a href="/admin/requests" className="admin-nav-link">
            <span>04</span>
            Requests
          </a>

          <a href="/admin/content" className="admin-nav-link">
            <span>05</span>
            Website
          </a>

        </nav>

        <div className="admin-sidebar-bottom">

          <a href="/" className="admin-nav-link">
            <span>↗</span>
            View Website
          </a>

          <button
            type="button"
            className="admin-logout"
            onClick={handleLogout}
          >
            <span>↪</span>
            Sign Out
          </button>

        </div>

      </aside>

      <main className="admin-main">
        {children}
      </main>

    </div>
  );
}

export default AdminLayout;