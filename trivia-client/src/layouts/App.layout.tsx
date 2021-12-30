
import axios from 'axios';
import { useContext } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/app.context';

export default function AppLayout() {

    const context = useContext(AppContext);
    const navigate = useNavigate();

    function logout() {
        axios.delete('/sessions', {
            headers: {
                'Authorization': `Bearer ${context.token}`
            }
        }).then(res => {
            sessionStorage.removeItem('username');
            sessionStorage.removeItem('token');
            context.setToken('');
            context.setUsername('');
            navigate('/login');
        }).catch(err => {
            console.log('There was a problem logging out');
            console.log(err);
            console.log('We are going to treat this as a logout anyways');
            sessionStorage.removeItem('username');
            sessionStorage.removeItem('token');
            context.setToken('');
            context.setUsername('');
            navigate('/login');
        })
    }

    return (
        <div className="container font-mono">
            <header className="w-full min-h-30 pt-2">
                <Link to="/"><h3>XTrivia</h3></Link>
                {   context.token ? 
                    <div onClick={logout} className="float-right">Logout</div>
                    : <Link to="login" className="float-right">Login</Link>
                }
            </header>
            <div className="mt-4">
                <Outlet />
            </div>
        </div>
    )
}