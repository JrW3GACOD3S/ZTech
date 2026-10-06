import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";

import { db } from "../../config/firebase";

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const servicesRef = collection(db, "services");

    const unsubscribe = onSnapshot(
      servicesRef,
      (snapshot) => {
        const serviceData = snapshot.docs
          .map((service) => ({
            id: service.id,
            ...service.data(),
          }))
          .filter((service) => service.active !== false)
          .sort(
            (a, b) =>
              Number(a.order || 0) - Number(b.order || 0)
          );

        setServices(serviceData);
        setLoading(false);
      },
      (error) => {
        console.error("Failed to load public services:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <section className="services" id="services">
      <div className="services-container">
        <div className="section-heading">
          <p className="section-eyebrow">What We Do</p>

          <h2>
            Technology built
            <br />
            <span>around your needs.</span>
          </h2>

          <p className="section-description">
            From websites and software to IT support and automation, ZTECH
            builds practical technology solutions for real-world problems.
          </p>
        </div>

        {loading ? (
          <div className="services-loading">
            Loading services...
          </div>
        ) : (
          <div className="services-grid">
            {services.map((service, index) => (
              <article
                className="service-card"
                key={service.id}
              >
                <span className="service-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="service-card-content">
                  <h3>{service.name}</h3>

                  <p>{service.description}</p>
                </div>

                <span className="service-arrow">↗</span>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Services;