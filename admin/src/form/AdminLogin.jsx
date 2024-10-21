import React, { useState } from 'react';
import { useNavigate , Link} from 'react-router-dom';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // for redirection

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const response = await fetch('https://ainwik-app-4.onrender.com/api/auth/login_admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error logging in.');
            }

            // Assuming successful login returns a token
            localStorage.setItem('adminToken', data.token); // Save token to local storage
            navigate('/adminPanel'); // Redirect to dashboard

        } catch (error) {
            setMessage(error.message);
        }
    };

    return (
        <div>
            <h2>Admin Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            <Link to='/register'>New User? Signup</Link>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AdminLogin;
