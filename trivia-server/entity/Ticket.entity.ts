import { BaseEntity, BeforeInsert, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User.entity";

@Entity()
export class Ticket extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(type => User)
    @JoinColumn()
    user: User;

    @Column()
    expires: Date;

    @BeforeInsert()
    setExpires() {
        let expiration = new Date();
        expiration.setMinutes(expiration.getMinutes() + 5);
        this.expires = expiration;
    }
}