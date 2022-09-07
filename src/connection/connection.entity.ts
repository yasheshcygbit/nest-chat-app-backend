import { User } from "src/users/user.entity";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()

export class Connection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fromUserId: number;
  @ManyToOne(() => User, user => user.fromUserConnections)
  fromUser: User;

  @Column()
  toUserId: number;
  @ManyToOne(() => User, user => user.toUserConnections)
  toUser: User
}