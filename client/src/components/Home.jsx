import React, { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
// Lazy load heavy 3D component with artificial delay to unblock main thread
const Background3D = React.lazy(() => {
    return new Promise(resolve => {
        setTimeout(() => resolve(import("./Background3D")), 3000); // Wait 3s before even starting to load 3D
    });
});
import "../App.css";
import API_URL from "../api";

function Home() {
    const [isOpen, setIsOpen] = useState(false);
    const [liked, setLiked] = useState(false);
    // State to trigger render after delay
    const [shouldRender3D, setShouldRender3D] = useState(false);

    useEffect(() => {
        const hasLiked = localStorage.getItem('portfolio_liked');
        if (hasLiked) {
            setLiked(true);
        }
        // Enable 3D container after initial load
        const timer = setTimeout(() => setShouldRender3D(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const handleLike = async () => {
        if (liked) return;

        try {
            await fetch(`${API_URL}/api/like`, {
                method: 'POST'
            });
            setLiked(true);
            localStorage.setItem('portfolio_liked', 'true');
        } catch (error) {
            console.error("Error sending like:", error);
        }
    };
    return (
        <div className="base-container">
            {shouldRender3D && (
                <Suspense fallback={<div className="canvas-placeholder" />}>
                    <Background3D />
                </Suspense>
            )}

            {/* Основной контент */}
            <motion.div
                className="home-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: isOpen ? 0.3 : 1 }}
                transition={{ duration: 0.5 }}
            >
                <header className="header">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        Welcome to my Portfolio
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        Created by <span>Ishenko Evgeniy</span>
                    </motion.p>

                    {/* Кнопка меню теперь тут, под текстом */}
                    <motion.nav
                        className="navbar"
                        onClick={() => setIsOpen(!isOpen)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="menu-trigger">{isOpen ? "Close" : "Menu"}</div>
                    </motion.nav>

                    {/* Like Button with Flying Animation */}
                    <div style={{ position: 'relative', marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                        <AnimatePresence>
                            {liked && (
                                <motion.div
                                    initial={{ opacity: 1, y: 0, scale: 1 }}
                                    animate={{ opacity: 0, y: -150, scale: 2, rotate: [0, -10, 10, 0] }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    style={{
                                        position: 'absolute',
                                        top: -50,
                                        pointerEvents: 'none',
                                        fontSize: '3rem',
                                        zIndex: 10,
                                        filter: 'drop-shadow(0 0 10px rgba(255, 77, 77, 0.5))'
                                    }}
                                >
                                    ❤️
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.button
                            className="navbar"
                            onClick={handleLike}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                borderColor: liked ? '#ff4d4d' : 'rgba(255, 255, 255, 0.1)',
                                backgroundColor: liked ? 'rgba(255, 77, 77, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                                boxShadow: liked ? "0 0 20px rgba(255, 77, 77, 0.2)" : "none"
                            }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                            whileHover={!liked ? {
                                scale: 1.05,
                                backgroundColor: 'rgba(255, 77, 77, 0.1)',
                                borderColor: '#ff4d4d',
                                boxShadow: "0 0 20px rgba(255, 77, 77, 0.4)"
                            } : {}}
                            whileTap={!liked ? { scale: 0.95 } : {}}
                            style={{
                                marginTop: 0,
                                cursor: liked ? 'default' : 'pointer',
                                minWidth: '180px'
                            }}
                            disabled={liked}
                        >
                            <div className="menu-trigger" style={{
                                color: liked ? '#ff4d4d' : '#fff',
                                transition: 'all 0.3s ease',
                                textShadow: liked ? "0 0 10px rgba(255, 77, 77, 0.5)" : "none",

                            }}>
                                {liked ? "THANKS!" : "LIKE ❤️"}
                            </div>
                        </motion.button>
                    </div>
                </header>
            </motion.div>

            {/* Полноэкранное меню */}
            {isOpen && (
                <motion.div
                    className="menu-overlay"
                    initial={{ opacity: 0, x: '100%' }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: '100%' }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                >
                    {/* Кнопка закрытия внутри меню (для надежности) */}
                    <div className="close-overlay" onClick={() => setIsOpen(false)}>×</div>

                    <ul>
                        <Link to="/about" style={{ textDecoration: 'none' }}>
                            <motion.li onClick={() => setIsOpen(false)} whileHover={{ x: 20 }}><span>01</span> About</motion.li>
                        </Link>
                        <Link to="/projects" style={{ textDecoration: 'none' }}>
                            <motion.li onClick={() => setIsOpen(false)} whileHover={{ x: 20 }}><span>02</span> Projects</motion.li>
                        </Link>
                        <Link to="/contact" style={{ textDecoration: 'none' }}>
                            <motion.li onClick={() => setIsOpen(false)} whileHover={{ x: 20 }}><span>03</span> Contact</motion.li>
                        </Link>
                    </ul>
                </motion.div>
            )}
        </div>
    );
}

export default Home;
