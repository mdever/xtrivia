import { useEffect } from "react";
import { useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import WebSocket from 'ws';

export default function HostRoom() {

    const { roomCode } = useParams();
    const [searchParams] = useSearchParams();
    const name = searchParams.get('name');
    const ticket = searchParams.get('ticket');
    let ws: WebSocket | null = null;

    useEffect(() => {
        ws = new WebSocket('ws://localhost');
        ws.on('open', () => {
            ws?.on('message', (data) => {
                console.log('Owner socket received message: ');
                console.log(data.toString());
            })
            ws?.send(JSON.stringify({
                ticket
            }));
        });
    }, [roomCode])

    return (
        <div>
            Host room
        </div>
    );
}