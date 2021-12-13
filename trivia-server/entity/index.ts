import { Connection } from 'typeorm';

let db:Connection = undefined;

export function setConnection(conn: Connection) {
    db = conn;
}

export function getConnection(): Connection {
    return db;
}

export * from './User';