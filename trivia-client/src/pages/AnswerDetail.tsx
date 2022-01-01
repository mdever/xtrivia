import { useEffect, useState } from "react";
import { useParams } from "react-router"
import { useRecoilState, useRecoilValue } from "recoil";
import { chosenAnswer, chosenAnswerId } from "../context/game.context";

export default function AnswerDetail() {
    const { answerId } = useParams();
    const [aId, setAnswerId] = useRecoilState(chosenAnswerId);
    const answer = useRecoilValue(chosenAnswer);

    const [text, setText] = useState(answer?.text);
    const [index, setIndex] = useState(answer?.index);
    const [correct, setCorrect] = useState(answer?.correct);
    

    useEffect(() => {
        setAnswerId(parseInt(answerId || '0'));
    }, [answerId]);

    useEffect(() => {
        setText(answer?.text);
        setCorrect(answer?.correct);
        setIndex(answer?.index);
    }, [answer]);

    function updateAnswer() {

    }

    return (
        <div className="content-center">
            <div className="grid grid-cols-2">
                <label htmlFor="text" className="pr-2">Answer Text</label>
                <input type="text" id="text" name="text" value={text} className="border-solid border-2 border-black" onChange={e => setText(e.target.value)} />
                <label htmlFor="index" className="pr-2">Index</label>
                <input type="text" name="index" id="index" value={index} className="border-solid border-2 border-black" onChange={e => setIndex(parseInt(e.target.value))} />
                <label htmlFor="correct" className="pr-2">Correct</label>
                <input type="checkbox" name="correct" id="correct" checked={correct} className="border-solid border-2 border-black" onChange={e => setCorrect(e.target.checked)} />
            </div>
            <button onClick={updateAnswer}>Update</button>
        </div>
        
    )
}