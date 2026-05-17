import React, { useState } from 'react';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Login = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const API_URL = process.env.NODE_ENV === 'production' 
        ? API_BASE_URL 
        : `${API_BASE_URL}/api`;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isRegister ? '/auth/register' : '/auth/login';
        try {
            const res = await axios.post(`${API_URL}${endpoint}`, formData, { withCredentials: true });
        
            if (res.status === 200 || res.status === 201) {
                if (isRegister) {
                    alert("Registration successful! You can now log in.");
                    setFormData({ name: '', email: '', password: '' });
                    setIsRegister(false);
                } else {
                    // Wait a moment for session to be fully established, then redirect
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 500);
                }
            }
        }   catch (err) { 
            console.error("Authentication Error Details:", err);
            alert("Auth Failed: " + (err.response?.data?.message || "Check your console network logs")); 
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}><i className="fas fa-leaf"></i> Green Grocery</h2>
                <form onSubmit={handleSubmit} style={styles.form}>
                    {isRegister && (
                        <input 
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Full Name" 
                            style={styles.input} 
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})} 
                            required 
                        />
                    )}
                    <input 
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Email" 
                        style={styles.input}
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})} 
                        required 
                    />
                    <input 
                        id="password"
                        name="password"
                        type="password" 
                        placeholder="Password" 
                        style={styles.input}
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})} 
                        required 
                    />
                    <button type="submit" style={styles.mainBtn}>
                        {isRegister ? 'Create Account' : 'Sign In'}
                    </button>
                </form>
                <div style={styles.divider}><span>OR</span></div>
                <button 
                    onClick={() => window.open(`${API_URL}/auth/google`, "_self")} 
                    style={styles.googleBtn}
                >
                    <i className="fab fa-google"></i> Continue with Google
                </button>
                <p style={styles.toggleText} onClick={() => setIsRegister(!isRegister)}>
                    {isRegister ? "Already have an account? Login" : "New here? Register"}
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f0f2f5' },
    card: { background: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '400px', textAlign: 'center' },
    title: { color: '#27ae60', marginBottom: '20px' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    input: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', outline: 'none' },
    mainBtn: { padding: '12px', borderRadius: '8px', border: 'none', background: '#27ae60', color: 'white', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' },
    divider: { margin: '20px 0', borderBottom: '1px solid #eee', lineHeight: '0.1em' },
    googleBtn: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    toggleText: { marginTop: '20px', color: '#3498db', cursor: 'pointer', fontSize: '0.9rem' }
};

export default Login;