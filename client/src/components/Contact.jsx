import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Background3D from "./Background3D";
import { Phone, Mail, Send, Github, Monitor } from "lucide-react";
import "../App.css";

function Contact() {
    const contacts = [
        {
            icon: <Phone size={30} />,
            label: "Phone",
            value: "+380 68 776 35 12",
            href: "tel:+380687763512",
            color: "#4ade80"
        },
        {
            icon: <Mail size={30} />,
            label: "Email",
            value: "Veteroktm809@gmail.com",
            href: "mailto:Veteroktm809@gmail.com",
            color: "#f472b6"
        },
        {
            icon: <Send size={30} />,
            label: "Telegram",
            value: "@brezzeyt",
            href: "https://t.me/brezzeyt",
            color: "#60a5fa"
        },
        {
            icon: <Github size={30} />,
            label: "GitHub",
            value: "BrezzeT",
            href: "https://github.com/BrezzeT",
            color: "#ffffff"
        },
        {
            icon: <Monitor size={30} />,
            label: "My Channel",
            value: "Join Code Journey",
            href: "https://t.me/brezze_code",
            color: "#a855f7" // Purple accent
        },
    ];

    return (
        <div className="base-container">
            <Background3D />

            <div className="contact-page-container">
                <div className="projects-header">
                    <Link to="/" className="back-link">
                        <span className="arrow">←</span> Back
                    </Link>
                    <h2>Get In Touch</h2>
                </div>

                <div className="contact-content">
                    <motion.div
                        className="contact-card-wrapper"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="contact-info-header">
                            <h3>Brezze</h3>
                            <p>Full Stack Developer</p>
                            <div className="status-badge">
                                <span className="status-dot"></span> Open for work
                            </div>
                        </div>

                        <div className="contact-links-grid">
                            {contacts.map((contact, index) => (
                                <motion.a
                                    key={index}
                                    href={contact.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="contact-link-item"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + (index * 0.1) }}
                                    whileHover={{ y: -5, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
                                    style={{ '--accent-color': contact.color }}
                                >
                                    <div className="icon-box" style={{ color: contact.color }}>
                                        {contact.icon}
                                    </div>
                                    <div className="text-box">
                                        <span className="label">{contact.label}</span>
                                        <span className="value">{contact.value}</span>
                                    </div>
                                    <div className="arrow-icon">→</div>
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default Contact;
