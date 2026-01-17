import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import Background3D from "./Background3D";
import API_URL from "../api";
import "../App.css";

const ProjectPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/projects/${id}`);
                setProject(response.data);
            } catch (error) {
                console.error("Error fetching project", error);
                navigate("/projects");
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
        window.scrollTo(0, 0);
    }, [id, navigate]);

    if (loading) return (
        <div className="base-container">
            <div className="page-loader">Loading Project...</div>
        </div>
    );

    if (!project) return null;

    return (
        <div className="base-container scrollable-page">
            <Background3D />

            <motion.div
                className="project-page-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {/* Back Button */}
                <Link to="/projects" className="back-link-float">
                    <span className="arrow">←</span> <span>Back to Projects</span>
                </Link>

                {/* Hero Section */}
                <div className="project-hero">
                    <img
                        src={project.image_url}
                        alt={project.title}
                        className="hero-image"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div className="hero-overlay"></div>
                    <motion.div
                        className="hero-text"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <span className="category-tag">{project.category}</span>
                        <h1>{project.title}</h1>
                    </motion.div>
                </div>

                {/* Info Grid */}
                <div className="project-container-deep">
                    <div className="project-info-grid">
                        <motion.div
                            className="project-main-info"
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, type: "spring" }}
                        >
                            <h2>Description</h2>
                            <p>{project.description}</p>

                            <div className="project-links-large">
                                {project.live_url && (
                                    <motion.a
                                        href={project.live_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-primary-large"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        ⚡ View Live Project
                                    </motion.a>
                                )}
                                {project.github_url && (
                                    <motion.a
                                        href={project.github_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-outline-large"
                                        whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        GitHub Source
                                    </motion.a>
                                )}
                            </div>
                        </motion.div>

                        <motion.div
                            className="project-sidebar"
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5, type: "spring" }}
                        >
                            <div className="sidebar-card">
                                <h3>Tech Stack</h3>
                                <div className="tech-pills">
                                    {project.technologies && project.technologies.split(',').map((tech, i) => (
                                        <span key={i} className="tech-pill">{tech.trim()}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="sidebar-card">
                                <h3>Details</h3>
                                <ul className="details-list">
                                    <li><span>Type</span> <span>Digital Product</span></li>
                                    <li><span>Client</span> <span>Portfolio Work</span></li>
                                    <li><span>Year</span> <span>2024</span></li>
                                </ul>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <footer className="project-footer">
                    <Link to="/projects" className="btn-text">
                        Next Project <span className="arrow">→</span>
                    </Link>
                </footer>
            </motion.div>
        </div>
    );
};

export default ProjectPage;
