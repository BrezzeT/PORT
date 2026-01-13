import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Background3D from "./Background3D";
import { Code, Database, Layout, Server, Cpu, Globe } from "lucide-react";
import "../App.css";

function About() {
    const skills = [
        { icon: <Layout />, name: "Frontend", tools: "React, Tailwind, Framer Motion, HTML5/CSS3" },
        { icon: <Server />, name: "Backend", tools: "Node.js, Express, Python" },
        { icon: <Database />, name: "Database", tools: "PostgreSQL, MongoDB" },
        { icon: <Code />, name: "Languages", tools: "JavaScript, Python, C++" },
    ];

    return (
        <div className="base-container">
            <Background3D />

            <div className="about-page-container">
                <header className="projects-header">
                    <Link to="/" className="back-link">
                        <span className="arrow">←</span> Back
                    </Link>
                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        About Me
                    </motion.h2>
                </header>

                <div className="about-content-wrapper">
                    <motion.div
                        className="about-bio-card"
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="bio-header">
                            <h3>Brezze</h3>
                            <span className="bio-role">Full Stack Developer</span>
                        </div>
                        <p className="bio-text">
                            I am a passionate developer who loves building interactive and scalable web applications.
                            My journey is driven by a curiosity to understand how things work under the hood and a desire to create
                            seamless digital experiences. I specialize in the MERN stack and enjoy experimenting with 3D web graphics.
                        </p>
                        <p className="bio-text">
                            When I'm not coding, I'm likely exploring new tech trends, optimizing algorithms, or thinking about
                            the next cool project to build.
                        </p>
                    </motion.div>

                    <div className="skills-grid">
                        {skills.map((skill, index) => (
                            <motion.div
                                key={index}
                                className="skill-card"
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 + (index * 0.1) }}
                                whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
                            >
                                <div className="skill-icon">{skill.icon}</div>
                                <h4>{skill.name}</h4>
                                <p>{skill.tools}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;
