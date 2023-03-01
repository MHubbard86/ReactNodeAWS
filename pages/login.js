import Layout from '../components/Layout';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import axios from 'axios';
import { showSuccessMessage, showErrorMessage } from '../helpers/alerts';
import { API } from '../config';
import { authenticate, isAuth } from '../helpers/auth';

const Login = () => {

    const [state, setState] = useState({
        email: '',
        password: '',
        error: '',
        success: '',
        buttonText: 'Login'
    });

    useEffect(() => {
        isAuth() && Router.push('/');
    }, []);

    const { email, password, error, success, buttonText } = state;

    const handleChange = (e) => {
        e.preventDefault();
        setState({...state, 
                [e.target.name]: e.target.value, 
                error: '', success: '', buttonText: 'Login'});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setState({...state, buttonText: 'Logging in'})
        try {
            const response = await axios.post('http://localhost:8080/api/login', {
                email,
                password
            });
            authenticate(response, () => { 
                isAuth() && isAuth().role === 'admin' ? Router.push('/admin') : Router.push('/user');
            })
        } catch (error) {
            console.log(error);
            setState({
                ...state,
                buttonText: 'Login',
                error: error.response.data.message
            })
        }
    }

    const LoginForm = () => {
        return (
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input type="email"
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Type your email"
                        value={email}
                        name='email'
                        required
                    />
                </div><br />
                <div className="form-group">
                    <input type="password"
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Type your password" 
                        value={password}
                        name='password'
                        required
                    />
                </div><br />
                <div className="form-group">
                    <button className="btn btn-outline-warning">
                        {buttonText}
                    </button>
                </div>
            </form>
        )
    }

    return (
        <Layout>           
            <div className="col-md-6 offset-md-3">
                <h1>Login</h1><br />
            </div>
            {success && showSuccessMessage(success)}
            {error && showErrorMessage(error)}
            <LoginForm />
            <Link href="/auth/password/forgot">
                <a clasName="text-danger float-right">
                    Forgot Password
                </a>
            </Link>
        </Layout>
    )
}

export default Login;