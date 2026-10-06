import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../../config/firebase";
import AdminLayout from "../../components/admin/AdminLayout";

function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    services: 0,
    requests: 0,
    newRequests: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let projects = 0;
    let services = 0;
    let requests = [];

    const updateStats = () => {
      setStats({
        projects,
        services,
        requests: requests.length,
        newRequests: requests.filter(
          (request) => request.status === "New"
        ).length,
      });

      setLoading(false);
    };

    const unsubscribeProjects = onSnapshot(
      collection(db, "projects"),
      (snapshot) => {
        projects = snapshot.size;
        updateStats();
      },
      (error) => {
        console.error("Failed to load project stats:", error);
        updateStats();
      }
    );

    const unsubscribeServices = onSnapshot(
      collection(db, "services"),
      (snapshot) => {
        services = snapshot.docs.filter(
          (service) => service.data().active !== false
        ).length;

        updateStats();
      },
      (error) => {
        console.error("Failed to load service stats:", error);
        updateStats();
      }
    );

    const unsubscribeRequests = onSnapshot(
      collection(db, "requests"),
      (snapshot) => {
        requests = snapshot.docs.map(
          (request) => request.data()
        );

        updateStats();
      },
      (error) => {
        console.error("Failed to load request stats:", error);
        updateStats();
      }
    );

    return () => {
      unsubscribeProjects();
      unsubscribeServices();
      unsubscribeRequests();
    };
  }, []);

  return (
    <AdminLayout>

      <header className="admin-header">

        <div>
          <p className="admin-header-label">
            ZTECH / ADMIN
          </p>

          <h1>Dashboard</h1>
        </div>

        <div className="admin-status">
          <span></span>
          System Online
        </div>

      </header>

      <section className="admin-overview">

        <div className="admin-stat-card">
          <span>PROJECTS</span>

          <strong>
            {loading ? "—" : stats.projects}
          </strong>

          <p>Published projects</p>
        </div>

        <div className="admin-stat-card">
          <span>SERVICES</span>

          <strong>
            {loading ? "—" : stats.services}
          </strong>

          <p>Active services</p>
        </div>

        <div className="admin-stat-card">
          <span>REQUESTS</span>

          <strong>
            {loading ? "—" : stats.requests}
          </strong>

          <p>Client requests</p>
        </div>

        <div className="admin-stat-card">
          <span>NEW REQUESTS</span>

          <strong>
            {loading ? "—" : stats.newRequests}
          </strong>

          <p>Awaiting attention</p>
        </div>

      </section>

      <section className="admin-welcome">

        <div>
          <p className="admin-section-label">
            CONTROL CENTER
          </p>

          <h2>
            Manage the
            <br />
            <span>ZTECH experience.</span>
          </h2>

          <p>
            From here you will be able to manage projects,
            services, client requests, and the content displayed
            on the ZTECH website.
          </p>
        </div>

        <div className="admin-welcome-mark">
          Z
        </div>

      </section>

      <section className="admin-quick-actions">

        <div className="admin-section-header">
          <div>
            <p className="admin-section-label">
              QUICK ACTIONS
            </p>

            <h2>Manage ZTECH</h2>
          </div>
        </div>

        <div className="admin-action-grid">

          <a
            href="/admin/projects"
            className="admin-action-card"
          >
            <span>01</span>
            <strong>Manage Projects</strong>
            <p>
              Add projects, images, links, descriptions,
              technologies and more.
            </p>
            <b>↗</b>
          </a>

          <a
            href="/admin/services"
            className="admin-action-card"
          >
            <span>02</span>
            <strong>Manage Services</strong>
            <p>
              Add, edit, remove, and organize the services
              ZTECH offers.
            </p>
            <b>↗</b>
          </a>

          <a
            href="/admin/requests"
            className="admin-action-card"
          >
            <span>03</span>
            <strong>Client Requests</strong>
            <p>
              View and manage project and quote requests
              submitted through the website.
            </p>
            <b>↗</b>
          </a>

        </div>

      </section>

    </AdminLayout>
  );
}

export default AdminDashboard;