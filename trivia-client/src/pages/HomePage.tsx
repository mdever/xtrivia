import { useContext } from "react"
import { AppContext } from "../context/app.context"

export default function HomePage() {

    const appContext = useContext(AppContext);

    return (
        <h3>Welcome to trivia</h3>
    )
}