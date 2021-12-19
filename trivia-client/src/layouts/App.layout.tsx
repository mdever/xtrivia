
import { Outlet } from 'react-router';

export default function AppLayout() {
    return (
        <div className="App">
            <header className="App-header">The header</header>
            <Outlet />
        </div>

    )
}