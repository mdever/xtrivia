import { Outlet, useParams } from "react-router"
import { Link } from "react-router-dom";

export default function GameLayout () {
    const { id } = useParams();
    return (
        <div>
            <div className="grid grid-cols-layout">
                <div className="flex flex-col">
                    <div>
                        <Link to="questions/1">Question 1</Link>
                    </div>
                    <div>
                    <Link to="questions/2">Question 2</Link>
                    </div>
                </div>
                <div className="p-2">
                    Game Layout for Game {id}
                    <Outlet />
                </div>
            </div>
        </div>
    )
}