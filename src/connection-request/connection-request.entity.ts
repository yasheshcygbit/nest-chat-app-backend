import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()

export class ConnectionRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: false
  })
  isAccepted: boolean;

  @Column()
  senderId: number;
  @ManyToOne(() => User, user => user.connectionRequestsSent)
  sender: User

  @Column()
  receiverId: number;
  @ManyToOne(() => User, user => user.connectionRequestsReceived)
  receiver: User
}