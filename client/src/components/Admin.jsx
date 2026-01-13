import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Background3D from "./Background3D";
import axios from "axios";
import "../App.css";
import API_URL from "../api";

const TECH_SUGGESTIONS = ["React", "Node.js", "Express", "PostgreSQL", "MongoDB", "Socket.io", "Three.js", "TailwindCSS", "Framer Motion", "Vite", "Next.js", "TypeScript", "JavaScript", "Python"];
const CAT_SUGGESTIONS = ["Full Stack", "Frontend", "Backend", "AI / Machine Learning", "Mobile App", "UI/UX Design", "Game Dev"];

function Admin() {

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [image_url, setImageUrl] = useState("");
    const [github_url, setGithubUrl] = useState("");
    const [live_url, setLiveUrl] = useState("");
    const [technologies, setTechnologies] = useState("");

    const [projects, setProjects] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Загрузка проектов при входе
    useEffect(() => {
        if (isAuthenticated) fetchProjects();
    }, [isAuthenticated]);

    const fetchProjects = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/projects`);
            setProjects(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_URL}/api/admin/login`, { password });
            if (response.data.success) {
                setIsAuthenticated(true);
            }
        } catch (error) {
            alert("Wrong password!");
        } finally {
            setIsLoading(false);
        }
    };

    // Заполнение формы данными для редактирования
    const startEditing = (project) => {
        setEditingId(project.id);
        setTitle(project.title);
        setCategory(project.category);
        setDescription(project.description);
        setImageUrl(project.image_url || "");
        setGithubUrl(project.github_url || "");
        setLiveUrl(project.live_url || "");
        setTechnologies(project.technologies || "");
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Скролл наверх к форме
    };

    const cancelEditing = () => {
        setEditingId(null);
        clearForm();
    };

    const clearForm = () => {
        setTitle("");
        setCategory("");
        setDescription("");
        setImageUrl("");
        setGithubUrl("");
        setLiveUrl("");
        setTechnologies("");
    };

    const deleteProject = async (id) => {
        if (!window.confirm("Are you sure you want to delete this project?")) return;
        try {
            await axios.delete(`${API_URL}/api/projects/${id}`);
            fetchProjects(); // Обновляем список
        } catch (err) {
            alert("Failed to delete");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const projectData = { title, category, description, image_url, github_url, live_url, technologies };

        try {
            if (editingId) {
                // Update existing
                await axios.put(`${API_URL}/api/projects/${editingId}`, projectData);
                alert("Project Updated!");
                setEditingId(null);
            } else {
                // Create new
                await axios.post(`${API_URL}/api/projects`, projectData);
                alert("Project Added!");
            }
            clearForm();
            fetchProjects();
        } catch (error) {
            console.error(error);
            alert("Operation failed");
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="base-container">
                <Background3D />
                <div className="admin-login">
                    <h2>Admin Access</h2>
                    <input
                        type="password"
                        placeholder="Secret Key"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={handleLogin} disabled={isLoading}>
                        {isLoading ? "Checking..." : "Login"}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="base-container">
            <Background3D />

            <div className="admin-layout">
                <motion.div
                    className="admin-container"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <header className="admin-header">
                        <Link to="/" className="back-link">← Back</Link>
                        <h2>{editingId ? "Edit Project" : "Add New Project"}</h2>
                    </header>

                    <form onSubmit={handleSubmit} className="admin-form">
                        <div className="form-group">
                            <label>Project Title</label>
                            <input type="text" placeholder="e.g. Portfolio Website" value={title} onChange={(e) => setTitle(e.target.value)} required />
                        </div>

                        <div className="form-group">
                            <label>Category</label>
                            <input
                                type="text"
                                placeholder="e.g. React / Node.js"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                                list="category-suggestions"
                            />
                            <datalist id="category-suggestions">
                                {CAT_SUGGESTIONS.map(cat => <option key={cat} value={cat} />)}
                            </datalist>
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea placeholder="Tell about the project..." value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                        </div>
                        <div className="form-group">
                            <label>Image URL</label>
                            <input type="text" placeholder="e.g. https://example.com/image.jpg" value={image_url} onChange={(e) => setImageUrl(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>GitHub URL</label>
                            <input type="text" placeholder="e.g. https://github.com/username/repository" value={github_url} onChange={(e) => setGithubUrl(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Live URL</label>
                            <input type="text" placeholder="e.g. https://example.com" value={live_url} onChange={(e) => setLiveUrl(e.target.value)} required />
                        </div>

                        <div className="form-group">
                            <label>Technologies</label>
                            <input
                                type="text"
                                placeholder="e.g. React, Node.js, Express"
                                value={technologies}
                                onChange={(e) => setTechnologies(e.target.value)}
                                required
                                list="tech-suggestions"
                            />
                            <datalist id="tech-suggestions">
                                {TECH_SUGGESTIONS.map(tech => <option key={tech} value={tech} />)}
                            </datalist>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="submit-btn">
                                {editingId ? "Update Project" : "Add Project"}
                            </button>
                            {editingId && (
                                <button type="button" onClick={cancelEditing} className="cancel-btn">
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </motion.div>

                <motion.div
                    className="admin-list"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <h3>Existing Projects</h3>
                    <div className="projects-list-scroll">
                        {projects.map(p => (
                            <div key={p.id} className="admin-project-item">
                                <div className="item-info">
                                    <strong>{p.title}</strong>
                                    <span>{p.category}</span>
                                </div>
                                <div className="item-actions">
                                    <button onClick={() => startEditing(p)} className="edit-btn">Edit</button>
                                    <button onClick={() => deleteProject(p.id)} className="delete-btn">×</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default Admin;
