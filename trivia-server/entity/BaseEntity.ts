import { PrimaryGeneratedColumn, Column, AfterInsert, AfterUpdate } from 'typeorm';

export class BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    createdAt: Date

    @Column()
    updatedAt: Date

    @AfterInsert()
    setCreatedAt() {
        this.createdAt = new Date();
    }

    @AfterUpdate()
    setUpdatedAt() {
        this.updatedAt = new Date();
    }
}