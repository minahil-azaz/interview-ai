import React,{useState} from 'react';
import "../Form.auth.scss";
import "../../../styles/button.scss";
import { useNavigate,Link } from 'react-router';
import {useAuth} from '../hooks/useAuth';

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const {loading, handleRegister} = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle login logic here
    await handleRegister(username, email, password);
    navigate('/');
    }
    if(loading) {
        return <main><p>Loading...</p></main>
        }

  return (
    <main>
      <h1>Register</h1>

      <form onSubmit={handleSubmit} className="form-auth">

        <div className="input-group">
          <label htmlFor="username">Username</label>
          {/* this is called two way binding to call the function setter here */}
          <input 
          onChange={(e) => setUsername(e.target.value)}
          type="text" id="username" name="username" placeholder="Enter your username" required />
        </div>
        
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input 
          onChange={(e) => setEmail(e.target.value)}
          type="email" id="email" name="email" placeholder="Enter your email"   required />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input 
          onChange={(e) => setPassword(e.target.value)}
          type="password" id="password" name="password" placeholder="Enter your password" required />
        </div>

        <button className="button primary" type="submit">
          Register
        </button>

      </form>

      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </main>
  );
};

export default Register;