import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/app.context";

export default function NewQuestion() {
    const { gameId } = useParams();
    const { token }  = useContext(AppContext);
    const [text, setText] = useState('');
    const [index, setIndex] = useState<number | null>(null)
    const [hint, setHint] = useState<string | null>(null);
    const navigate = useNavigate();

    function createQuestion() {
        axios.post(`/games/${gameId}/questions`, {
            text,
            index,
            hint
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            const { id } = res.data;
            navigate(`../${id}`);
        }).catch(err => {
            console.log('Could not create question');
            console.log(err);
        })
    }

    return (
        <div className="content-center">
            <div className="grid grid-cols-2">
                <label htmlFor="text" className="pr-2">Question Text</label>
                <input type="text" id="text" name="text" className="border-solid border-2 border-black" onChange={e => setText(e.target.value)} />
                <label htmlFor="index" className="pr-2">Index</label>
                <input type="text" name="index" id="index" className="border-solid border-2 border-black" onChange={e => setIndex(parseInt(e.target.value))} />
                <label htmlFor="hint" className="pr-2">Hint</label>
                <input type="text" name="hint" id="hint" className="border-solid border-2 border-black" onChange={e => setHint(e.target.value)} />
            </div>
            <button onClick={createQuestion}>Create</button>
        </div>
    )
}