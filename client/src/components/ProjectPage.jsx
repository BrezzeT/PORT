import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Background3D from "./Background3D";
import API_URL from "../api";
import "../App.css";

const ProjectPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isImageZoomed, setIsImageZoomed] = useState(false);

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

    const currentYear = new Date().getFullYear();

    return (
        <div className="base-container scrollable-page">
            <Background3D />

            <AnimatePresence>
                {isImageZoomed && (
                    <motion.div
                        className="image-lightbox"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsImageZoomed(false)}
                    >
                        <motion.img
                            src={project.image_url}
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            onClick={(e) => e.stopPropagation()}
                        />
                        <button className="close-lightbox">×</button>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                className="project-page-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {/* Back Button */}
                <Link to="/projects" className="back-link-float">
                    <span className="arrow">←</span> <span>Back</span>
                </Link>

                {/* Hero Section */}
                <div className="project-hero-modern">
                    <div className="hero-bg-blur">
                        <img src={project.image_url} alt="" />
                    </div>

                    <div className="project-hero-container">
                        <motion.div
                            className="hero-image-card"
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            onClick={() => setIsImageZoomed(true)}
                        >
                            <img src={project.image_url} alt={project.title} />
                            <div className="view-hint">Click to enlarge</div>
                        </motion.div>

                        <motion.div
                            className="hero-main-text"
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <span className="category-tag">{project.category}</span>
                            <h1>{project.title}</h1>
                            <div className="hero-btns">
                                {project.live_url && (
                                    <motion.a
                                        href={project.live_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-primary-small"
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        Live Preview
                                    </motion.a>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>

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
                                        ⚡ Full Live Prototype
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
                                <h3>Project Details</h3>
                                <ul className="details-list">
                                    <li><span>Type</span> <span>Digital Product</span></li>
                                    <li><span>Client</span> <span>Portfolio Work</span></li>
                                    <li><span>Year</span> <span>{currentYear}</span></li>
                                </ul>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <footer className="project-footer">
                    <Link to="/projects" className="btn-text">
                        Back to Gallery <span className="arrow">→</span>
                    </Link>
                </footer>
            </motion.div>
        </div>
    );
};

export default ProjectPage;
