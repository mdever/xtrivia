import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import { AppContext, TAppContext } from "../context/app.context";

export function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    async function login(context: TAppContext) {
        try {
            const login = await axios.post('/sessions', {
                username,
                password
            });

            context.setToken(login.data.token);
            context.setUsername(username);

            sessionStorage.setItem('token', login.data.token);
            sessionStorage.setItem('username', username);
            navigate('/');

        } catch (err) {
            console.log('could not login');
            console.log(JSON.stringify(err, null, 2));
        }

    }

    return (
        <AppContext.Consumer>
            {
                context => (
                <div>
                    <div className="p-8 max-w-sm mx-auto bg-white rounded-xl shadow-lg space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6">
                        <div className="text-center space-y-2 sm:text-left">
                            <div className="space-y-0.5">
                                <p className="text-lg text-black font-semibold">
                                    Create Account
                                </p>
                                <form>
                                    <label htmlFor="username" className="pr-2">Username</label>
                                    <input type="text" name="username" className="border border-rounded" onChange={(e) => setUsername(e.target.value)}/>
                                    <label htmlFor="password" className="pr-2">Password</label>
                                    <input type="password" className="border border-rounded" name="password" onChange={(e) => setPassword(e.target.value)}/>
                                </form>
                            </div>
                            <button onClick={() => login(context)} className="px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">Login</button>
                        </div>
                    </div>
                </div>
                )
            }

        </AppContext.Consumer>

    )
}