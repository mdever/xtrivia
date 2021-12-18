import { Connection } from 'typeorm';

let db:Connection = undefined;

export function setConnection(conn: Connection) {
    db = conn;
}

export function getConnection(): Connection {
    return db;
}

export * from './Answer.entity';
export * from './BaseEntity.entity';
export * from './Game.entity';
export * from './Question.entity';
export * from './Session.entity';
export * from './User.entity';
export * from './Room.entity';
export * from './Ticket.entity';
