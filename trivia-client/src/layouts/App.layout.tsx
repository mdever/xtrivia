
import { useContext } from 'react';
import { Outlet } from 'react-router';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/app.context';

export default function AppLayout() {

    const context = useContext(AppContext);

    return (
        <div className="container font-mono">
            <header className="w-full min-h-30 pt-2">
                <Link to="/"><h3>XTrivia</h3></Link>
                {   context.token ? 
                    <Link to="logout" className="float-right">Logout</Link>
                    : <Link to="login" className="float-right">Login</Link>
                }
            </header>
            <div className="mt-4">
                <Outlet />
            </div>
        </div>
    )
}