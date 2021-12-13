import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from './BaseEntity.entity';
import { Game } from './Game.entity';
import { Session } from './Session.entity';

@Entity({name: 'users'})
export class User extends BaseEntity {

    @Column()
    username: string;

    @Column()
    email: string;

    @OneToMany(type => Game, game => game.owner, {
        cascade: true
    })
    games: Promise<Game[]>;

    @Column()
    pwHash: string;

    @Column()
    salt: string;

    @OneToOne(() => Session)
    session: Session | null;
}