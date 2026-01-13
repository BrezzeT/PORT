import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import Background3D from "./Background3D";
import "../App.css";
import API_URL from "../api";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 100 }
    }
};

const ProjectCard = ({ project, onClick, index }) => {
    // Every 3rd item is "featured" (spans 2 columns) for variety
    const isFeatured = index % 3 === 0;

    return (
        <motion.div
            className={`project-card ${isFeatured ? 'featured-card' : ''}`}
            layoutId={`card-${project.id}`}
            onClick={() => onClick(project.id)}
            variants={cardVariants}
            whileHover={{ y: -15, scale: 1.02 }}
        >
            <div className="card-glass-bg"></div>
            <div className="card-content">
                <div className="project-category-badge">{project.category}</div>
                <h3>{project.title}</h3>
                <p>{project.description.substring(0, 100)}...</p>
                <div className="action-row">
                    <span className="project-link">Explore Case</span>
                    <span className="arrow-icon">→</span>
                </div>
            </div>
        </motion.div>
    );
};

const ProjectModal = ({ selectedProject, onClose }) => {
    if (!selectedProject) return null;

    return (
        <motion.div
            className="modal-overlay"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(10px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            onClick={onClose}
        >
            <motion.div
                className="modal-content"
                layoutId={`card-${selectedProject.id}`}
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
                <button className="close-modal" onClick={onClose}>×</button>

                <div className="modal-image-container">
                    {selectedProject.image_url ? (
                        <img
                            src={selectedProject.image_url}
                            alt={selectedProject.title}
                            loading="lazy"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                                e.target.parentNode.classList.add('no-image-fallback');
                            }}
                        />
                    ) : (
                        <div className="no-image-placeholder">
                            <span>{selectedProject.title}</span>
                        </div>
                    )}
                    <div className="image-overlay-gradient"></div>
                </div>

                <div className="modal-body">
                    <div className="modal-header-row">
                        <div>
                            <span className="modal-category">{selectedProject.category}</span>
                            <h2>{selectedProject.title}</h2>
                        </div>
                    </div>

                    <p className="modal-description">{selectedProject.description}</p>

                    <div className="modal-tech-stack">
                        {selectedProject.technologies && selectedProject.technologies.split(',').map((tech, i) => (
                            <span key={i} className="tech-tag">{tech.trim()}</span>
                        ))}
                    </div>

                    <div className="modal-actions">
                        {selectedProject.live_url && (
                            <a href={selectedProject.live_url} target="_blank" rel="noopener noreferrer" className="btn-primary">
                                <span className="btn-icon">⚡</span> Live Demo
                            </a>
                        )}
                        {selectedProject.github_url && (
                            <a href={selectedProject.github_url} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                                <span className="btn-icon">GitHub</span>
                            </a>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

function Projects() {
    const [projects, setProjects] = useState([]);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/projects`);
                setProjects(response.data);
            } catch (error) {
                console.error("Failed to load projects", error);
            }
        }
        fetchProjects();
    }, []);

    const selectedProject = useMemo(() =>
        projects.find(p => p.id === selectedId),
        [projects, selectedId]);

    useEffect(() => {
        if (selectedId) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; }
    }, [selectedId]);

    return (
        <div className="base-container">
            <Background3D />

            <div className="projects-container">
                <header className="projects-header">
                    <Link to="/" className="back-link">
                        <span className="arrow">←</span> Back
                    </Link>
                    <motion.h2
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1, type: "spring" }}
                    >
                        Selected Works
                    </motion.h2>
                </header>

                <motion.div
                    className="projects-grid"
                    variants={containerVariants}
                    initial="hidden"
                    animate={projects.length > 0 ? "visible" : "hidden"}
                    key={projects.length}
                >
                    {projects.map((project, index) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            index={index}
                            onClick={setSelectedId}
                        />
                    ))}
                </motion.div>
            </div>

            <AnimatePresence>
                {selectedId && (
                    <ProjectModal
                        selectedProject={selectedProject}
                        onClose={() => setSelectedId(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

export default Projects;
