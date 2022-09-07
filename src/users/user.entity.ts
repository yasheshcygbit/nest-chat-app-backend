import { Exclude } from "class-transformer";
import { ConnectionRequest } from "src/connection-request/connection-request.entity";
import { Connection } from "src/connection/connection.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @OneToMany(() => ConnectionRequest, connectionRequest => connectionRequest.sender)
  connectionRequestsSent: ConnectionRequest[]

  @OneToMany(() => ConnectionRequest, connectionRequest => connectionRequest.receiver)
  connectionRequestsReceived: ConnectionRequest[]

  @OneToMany(() => Connection, connection => connection.fromUser)
  fromUserConnections: Connection[]

  @OneToMany(() => Connection, connection => connection.toUser)
  toUserConnections: Connection[]

  // @ManyToMany(() => Connection, connection => connection.users)
  // @JoinTable()
  // connections: Connection[]

}