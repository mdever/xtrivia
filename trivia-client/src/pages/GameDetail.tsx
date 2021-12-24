import { useParams } from "react-router"
import { Link } from "react-router-dom";

export default function GameDetail () {
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
                    Game Detail for Game {id}
                </div>
            </div>
        </div>
    )
}