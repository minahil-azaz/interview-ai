import React,{ useState } from 'react';
import "../Form.auth.scss";
import "../../../styles/button.scss";
import { useNavigate, Link } from 'react-router';
import {useAuth} from '../hooks/useAuth';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();



    const {loading, handleLogin} = useAuth();
    const handleSubmit = async(e) => {
    e.preventDefault();
    // Handle login logic here
    await handleLogin(email, password);
        navigate('/');
  };
  if(loading) {
return <main><p>Loading...</p></main>
  }

  return (
    <main>
      <h1>Login</h1>

      <form onSubmit={handleSubmit} className="form-auth">
        
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input 
          onChange={(e) => setEmail(e.target.value)}
          type="email" id="email" name="email" required />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input 
          onChange={(e) => setPassword(e.target.value)}
          type="password" id="password" name="password" required />
        </div>

        <button className="button primary" type="submit">
          Login
        </button>

      </form>
       <p className="register-link mt-2">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </main>
  );
};

export default Login;