import { Channel } from "src/channels/channel.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserChannel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  channelId: number;
  @ManyToOne(() => Channel, channel => channel.userChannels)
  channel: Channel

  @Column()
  userId: number;
  @ManyToOne(() => User, user => user.userChannels)
  user: User
}