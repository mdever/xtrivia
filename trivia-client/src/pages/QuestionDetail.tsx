import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { chosenQuestion, chosenQuestionId } from "../context/game.context";

export default function QuestionDetail() {

    const question = useRecoilValue(chosenQuestion);
    const [text, setText] = useState(question?.text);
    const [index, setIndex] = useState(question?.index);
    const [hint, setHint] = useState(question?.hint);

    useEffect(() => {
        setText(question?.text);
        setIndex(question?.index);
        setHint(question?.hint);
    }, [question])

    function updateQuestion() {

    }

    return (
        <div>
            <Link to="answers">View Answers</Link>

            <div className="content-center">
                <div className="grid grid-cols-2">
                    <label htmlFor="text" className="pr-2">Question Text</label>
                    <input type="text" id="text" name="text" value={text} className="border-solid border-2 border-black" onChange={e => setText(e.target.value)} />
                    <label htmlFor="index" className="pr-2">Index</label>
                    <input type="text" name="index" id="index" value={index} className="border-solid border-2 border-black" onChange={e => setIndex(parseInt(e.target.value))} />
                    <label htmlFor="hint" className="pr-2">Hint</label>
                    <input type="text" name="hint" id="hint" value={hint} className="border-solid border-2 border-black" onChange={e => setHint(e.target.value)} />
                </div>
                <button onClick={updateQuestion}>Update</button>
            </div>
        </div>
    )
}