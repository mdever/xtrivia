import { BaseEntity, BeforeInsert, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Room } from "./Room.entity";
import { User } from "./User.entity";

@Entity()
export class Ticket extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(type => User)
    @JoinColumn()
    user: User;

    @ManyToOne(type => Room, room => room.tickets)
    @JoinColumn()
    room: Room;

    @Column()
    expires: Date;

    @Column()
    ticket: string;

    @BeforeInsert()
    setExpires() {
        let expiration = new Date();
        expiration.setMinutes(expiration.getMinutes() + 5);
        this.expires = expiration;
    }
}