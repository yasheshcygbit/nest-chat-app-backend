import { UserChannel } from "src/user-channel/user-channel.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  
  @OneToMany(() => UserChannel, userChannel => userChannel.channelId)
  userChannels: UserChannel[]
}