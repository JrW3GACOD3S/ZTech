import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import { db } from "../../../config/firebase";
import AdminLayout from "../../../components/admin/AdminLayout";

function ProjectsManager() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const projectsRef = collection(db, "projects");

    const unsubscribe = onSnapshot(
      projectsRef,
      (snapshot) => {
        const projectData = snapshot.docs
          .map((project) => ({
            id: project.id,
            ...project.data(),
          }))
          .sort((a, b) => {
            const aTime = a.createdAt?.seconds || 0;
            const bTime = b.createdAt?.seconds || 0;

            return bTime - aTime;
          });

        setProjects(projectData);
        setLoading(false);
      },
      (error) => {
        console.error("Failed to load projects:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleDelete = async (projectId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "projects", projectId));
    } catch (error) {
      console.error("Failed to delete project:", error);
      alert("Failed to delete project.");
    }
  };

  return (
    <AdminLayout>
      <div className="admin-manager">

        <div className="admin-manager-header">
          <div>
            <p className="admin-eyebrow">
              CONTENT MANAGEMENT
            </p>

            <h1>Projects</h1>

            <span>
              Manage the projects displayed on the ZTECH website.
            </span>
          </div>

          <button
            type="button"
            className="admin-primary-button"
            onClick={() => navigate("/admin/projects/new")}
          >
            + Add Project
          </button>
        </div>

        {loading ? (
          <div className="admin-manager-loading">
            Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="admin-empty-state">

            <div className="admin-empty-icon">
              +
            </div>

            <h2>No projects yet</h2>

            <p>
              Add your first project to start building the ZTECH
              portfolio.
            </p>

            <button
              type="button"
              className="admin-primary-button"
              onClick={() => navigate("/admin/projects/new")}
            >
              Add Your First Project
            </button>

          </div>
        ) : (
          <div className="admin-project-grid">

            {projects.map((project) => (
              <article
                key={project.id}
                className="admin-project-card"
              >

                <div className="admin-project-image">

                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title || "Project"}
                    />
                  ) : (
                    <span>ZTECH</span>
                  )}

                </div>

                <div className="admin-project-content">

                  <div className="admin-project-top">

                    <div>

                      <h2>
                        {project.title}
                      </h2>

                      {project.category && (
                        <span className="admin-project-category">
                          {project.category}
                        </span>
                      )}

                    </div>

                    {project.featured && (
                      <span className="admin-featured-badge">
                        Featured
                      </span>
                    )}

                  </div>

                  <p className="admin-project-description">
                    {project.description ||
                      "No project description provided."}
                  </p>

                  {Array.isArray(project.technologies) &&
                    project.technologies.length > 0 && (
                      <div className="admin-project-technologies">

                        {project.technologies.map(
                          (technology) => (
                            <span key={technology}>
                              {technology}
                            </span>
                          )
                        )}

                      </div>
                    )}

                  {project.website && (
                    <a
                      href={project.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="admin-project-website"
                    >
                      Visit Project ↗
                    </a>
                  )}

                  <div className="admin-project-actions">

                    <button
                      type="button"
                      className="admin-secondary-button"
                      onClick={() =>
                        navigate(
                          `/admin/projects/edit/${project.id}`
                        )
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="admin-danger-button"
                      onClick={() =>
                        handleDelete(project.id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </article>
            ))}

          </div>
        )}

      </div>
    </AdminLayout>
  );
}

export default ProjectsManager;