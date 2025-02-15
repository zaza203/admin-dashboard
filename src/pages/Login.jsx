import React, { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import logo from '../assets/logo.jpg'
import branding from '../assets/branding.png'
import supabase from '../services/supabaseClient'

const Login = ({ onLoginSuccess }) => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const clearSession = async () => {
            const { error } = await supabase.auth.signOut();
            if (error) console.log('Error clearing session:', error);
        };
        clearSession();
    }, []);

    async function checkAndSignInAnonymously() {
        try {
            const { data: session } = await supabase.auth.getSession();
            if (!session.session) {
                try {
                    const { data, error } = await supabase.auth.signInAnonymously();
                    if (error) {
                        console.log("Anonymous sign in error:", error);
                    }
                } catch (err) {
                    console.log("Error in anonymous sign in:", err);
                }
            }
        } catch (error) {
            console.log("Session check error:", error);
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            await supabase.auth.signOut();
            
            await checkAndSignInAnonymously();

            const { data: admin, error } = await supabase.rpc('verify_admin', {
                phone_param: phone,
                password_param: password
            });

            if (error || !admin || admin.length === 0) {
                setError("Wrong credentials");
                toast.error(error ? error.message : "Wrong credentials");
                return;
            }

            if (admin.length > 0) {
                localStorage.setItem('admin', admin[0].id);
            } else {
                console.error("Admin array is empty!");
            }
            toast.success("Login successfully!")
            onLoginSuccess();
            
        } catch (error) {
            toast.error("An error occurred while logging in");
            console.log("error executing rpc", error);
        }
    }

      
  return (
    <div className='d-flex vh-100 justify-content-center align-items-center'>
        <div className='card responsive-card'>
            <h2 className='text-center mt-3'>Sign In</h2>
            <form className='m-4' onSubmit={handleLogin}>
                <div className="mb-3">
                    <label htmlFor="phone-number" className="form-label">Phone number</label>
                    <input
                        id='phone-number' 
                        type="tel" 
                        maxLength="9"
                        inputMode="numeric"
                        className="form-control" 
                        placeholder="Phone number" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required />
                </div>
                <div className="mb-1">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input 
                    id='password' 
                    type={showPassword ? 'text' : 'password'} 
                    className="form-control" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required />
                </div>
                <ToastContainer />
                <div className='d-flex justify-content-between mb-5'>
                    <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="showPassword" checked={showPassword} onChange={() => setShowPassword(!showPassword)}/>
                        <label className="form-check-label" htmlFor="showPassword">Show password</label>
                    </div>
                    <a href='#'>Forgot Password?</a>
                </div>

                <div className="d-flex justify-content-center">
                    <button className="btn w-75 btn-primary" type="submit">Sign In</button>
                </div>
            </form>
            <div className='d-flex justify-content-center align-items-center mb-3'>
                <img className='rounded' src={ logo } style={{ width: '24px', height:'24px' }} alt='Rentam' />
                <img className='' src={ branding } style={{width: '150px', height:'40px' }} alt='Rentam' />
            </div>
        </div>
    </div>
  )
}

export default Login
