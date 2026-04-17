import React, { useState } from 'react';
import api from '../api/axiosInstance';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '', otp: '' ,contact:'',age:''});
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false); // NEW: To prevent double clicks
  
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Phase 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent double execution if already loading

    setLoading(true);
    setError('');
    
    // Generate a 6-digit OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    
    try {
      await api.post('api/auth/send', {
        to: form.email,
        subject: 'Your Verification Code',
        message: `Hi ${form.username}, your OTP is ${newOtp}`
      });
      console.log(`your OTP is ${newOtp}`);
      setGeneratedOtp(newOtp);
      setIsOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send email.');
    } finally {
      setLoading(false); // Re-enable button
    }
  };

  // Phase 2: Verify and Register
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError('');
    if (form.otp !== generatedOtp) {
      setError('Invalid OTP code.');
      return;
    }

    setLoading(true);
    try {
      const { otp, ...registrationData } = form;
      await api.post('api/auth/register', registrationData);
      
      setSuccess('Account created! Redirecting...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    card: { background:'white', padding:'40px', borderRadius:'12px', boxShadow:'0 4px 20px rgba(0,0,0,0.1)', width:'360px' },
    title: { textAlign:'center', marginBottom:'24px', color:'#1a3c6e' },
    input: { width:'100%', padding:'12px', margin:'8px 0', borderRadius:'8px', border:'1px solid #ddd', boxSizing:'border-box', fontSize:'15px' },
    btn: { width:'100%', padding:'12px', background: loading ? '#ccc' : '#1a3c6e', color:'white', border:'none', borderRadius:'8px', cursor: loading ? 'not-allowed' : 'pointer', fontSize:'16px', marginTop:'8px' },
    error: { color:'red', textAlign:'center', fontSize: '14px' },
    success: { color:'green', textAlign:'center', fontSize: '14px' },
    footer: { textAlign:'center', marginTop:'16px', color:'#666' }
  };

  return (
    <div className="flex items-center justify-center h-screen  w-full bg-slate-50 px-4 overflow-hidden">
      <div className='mb-4 mt-4' style={styles.card}>
        <h2 style={styles.title}>{isOtpSent ? "Verify OTP" : "Register"}</h2>
        
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        <form onSubmit={isOtpSent ? handleVerifyAndRegister : handleSendOtp}>
          {!isOtpSent ? (
            <>
              <input name="username" placeholder="Username" value={form.username} onChange={handleChange} style={styles.input} required />
              <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} style={styles.input} required />
              <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} style={styles.input} required />
               <input name="contact" type="number" placeholder="contact" value={form.contact} onChange={handleChange} style={styles.input} required />
                <input name="age" type="number" placeholder="age" value={form.age} onChange={handleChange} style={styles.input} required />
              <button type="submit" style={styles.btn} disabled={loading}>
                {loading ? 'Sending...' : 'Register & Send OTP'}
              </button>
            </>
          ) : (
            <>
              <input name="otp" placeholder="Enter OTP" value={form.otp} onChange={handleChange} style={styles.input} required />
                    <button type="button" onClick={() => setIsOtpSent(false)} style={{...styles.btn, background: '#ccc', color: '#333'}}>Back</button>   
           <button type="submit" style={styles.btn} disabled={loading}>
                {loading ? 'Verifying...' : 'Verify & Complete'}
              </button>
            </>
          )}
        </form>
        <p style={styles.footer}>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
};

export default Register;