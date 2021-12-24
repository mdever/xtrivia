import { Outlet } from "react-router";

export default function GamesLayout() {
    return (
        <div className="grid grid-cols-layout">
            <div className="games-list">
                Games List
            </div>
            <div className="p-2">
                Games Layout
                <Outlet />
            </div>
        </div>
    )
}