import {BaseEntity, Column, UpdateDateColumn} from "typeorm";

export class BaseClass extends BaseEntity {
    @Column({
        nullable: true,
        default: true
    })
    isActive: boolean;

    @Column({
        nullable: true,
        default: false
    })
    isDelete: boolean;

    @Column()
    @UpdateDateColumn()
    createAt: Date;

    @Column()
    @UpdateDateColumn()
    updateAt: Date;
}