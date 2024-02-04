import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {BaseClass} from "./BaseClass";

@Entity()
export class Name extends BaseClass {
  @PrimaryGeneratedColumn()
  id: string

  @Column({unique: true})
  firstName: string

  @Column()
  lastName: string
}