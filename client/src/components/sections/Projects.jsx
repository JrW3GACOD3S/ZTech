
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";

import { db } from "../../config/firebase";

function Projects() {
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

            return aTime - bTime;
          });

        setProjects(projectData);
        setLoading(false);
      },
      (error) => {
        console.error("Failed to load public projects:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <section className="projects" id="projects">
      <div className="projects-container">
        <div className="section-heading">
          <p className="section-eyebrow">Selected Work</p>

          <h2>
            Problems solved
            <br />
            <span>through technology.</span>
          </h2>

          <p className="section-description">
            A selection of products, platforms, and digital solutions
            developed to solve practical problems.
          </p>
        </div>

        {loading ? (
          <div className="projects-loading">
            Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="projects-empty">
            <p>Our projects are currently being updated.</p>
          </div>
        ) : (
          <div className="projects-list">
            {projects.map((project, index) => (
              <article
                className="project-card"
                key={project.id}
              >
                {project.image ? (
                  <div className="project-image-wrapper">
                    <img
                      src={project.image}
                      alt={`${project.title || "ZTECH project"} preview`}
                      className="project-image"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div
                    className="project-image-wrapper project-image-placeholder"
                    aria-hidden="true"
                  >
                    <span>ZTECH</span>
                  </div>
                )}

                <div className="project-top">
                  <span className="project-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="project-category">
                    {project.category || "Digital Solution"}
                  </span>
                </div>

                <div className="project-main">
                  <div>
                    <h3>{project.title}</h3>

                    <p>{project.description}</p>
                  </div>

                  {project.website ? (
                    <a
                      href={project.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-arrow"
                      aria-label={`Visit ${project.title} website`}
                    >
                      ↗
                    </a>
                  ) : (
                    <span className="project-arrow">↗</span>
                  )}
                </div>

                {Array.isArray(project.technologies) &&
                  project.technologies.length > 0 && (
                    <div className="project-technologies">
                      {project.technologies.map((technology) => (
                        <span key={technology}>
                          {technology}
                        </span>
                      ))}
                    </div>
                  )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Projects;
