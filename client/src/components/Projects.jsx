import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Background3D from "./Background3D";
import API_URL from "../api";
import "../App.css";

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
    hidden: { y: 30, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 100 }
    }
};

const ProjectCard = ({ project, index }) => {
    const isFeatured = index % 3 === 0;

    return (
        <Link to={`/project/${project.id}`} style={{ textDecoration: 'none' }}>
            <motion.div
                className={`project-card ${isFeatured ? 'featured-card' : ''}`}
                variants={cardVariants}
                whileHover={{ y: -10, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
            >
                <div className="card-glass-bg"></div>
                <div className="card-content">
                    <div className="project-category-badge">{project.category}</div>
                    <h3>{project.title}</h3>
                    <p>{project.description.substring(0, 100)}...</p>
                    <div className="action-row">
                        <span className="project-link">View Case Study</span>
                        <span className="arrow-icon">→</span>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

function Projects() {
    const [projects, setProjects] = useState([]);

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
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="base-container scrollable-page">
            <Background3D />

            <div className="projects-container">
                <header className="projects-header">
                    <Link to="/" className="back-link">
                        <span className="arrow">←</span> Back
                    </Link>
                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
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
                        />
                    ))}
                </motion.div>
            </div>
        </div>
    );
}

export default Projects;
