import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import Hero from "./components/sections/Hero";
import Services from "./components/sections/Services";
import HowWeWork from "./components/sections/HowWeWork";
import Projects from "./components/sections/Projects";
import About from "./components/sections/About";
import Contact from "./components/sections/Contact";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProtectedAdminRoute from "./pages/admin/ProtectedAdminRoute";

import ProjectsManager from "./pages/admin/projects/ProjectsManager";
import AddProject from "./pages/admin/projects/AddProject";
import EditProject from "./pages/admin/projects/EditProject";

import ServicesManager from "./pages/admin/services/ServicesManager";
import AddService from "./pages/admin/services/AddService";
import EditService from "./pages/admin/services/EditService";

import RequestsManager from "./pages/admin/requests/RequestsManager";

import "./App.css";

function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Services />
        <HowWeWork />
        <Projects />
        <About />
        <Contact />
      </main>

      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public website */}
        <Route path="/" element={<Home />} />

        {/* Admin login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />

        {/* Projects */}
        <Route
          path="/admin/projects"
          element={
            <ProtectedAdminRoute>
              <ProjectsManager />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/projects/new"
          element={
            <ProtectedAdminRoute>
              <AddProject />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/projects/edit/:projectId"
          element={
            <ProtectedAdminRoute>
              <EditProject />
            </ProtectedAdminRoute>
          }
        />

        {/* Services */}
        <Route
          path="/admin/services"
          element={
            <ProtectedAdminRoute>
              <ServicesManager />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/services/new"
          element={
            <ProtectedAdminRoute>
              <AddService />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/services/edit/:serviceId"
          element={
            <ProtectedAdminRoute>
              <EditService />
            </ProtectedAdminRoute>
          }
        />

        {/* Client requests */}
        <Route
          path="/admin/requests"
          element={
            <ProtectedAdminRoute>
              <RequestsManager />
            </ProtectedAdminRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;