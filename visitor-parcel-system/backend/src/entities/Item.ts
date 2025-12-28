import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

export enum ItemType {
    VISITOR = "Visitor",
    PARCEL = "Parcel"
}

export enum ItemStatus {
    // Visitor statuses
    NEW = "New",
    WAITING = "Waiting",
    APPROVED = "Approved",
    REJECTED = "Rejected",
    ENTERED = "Entered",
    EXITED = "Exited",

    // Parcel statuses
    RECEIVED = "Received",
    ACKNOWLEDGED = "Acknowledged",
    COLLECTED = "Collected"
}

@Entity()
export class Item {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    resident_id!: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: "resident_id" })
    resident!: User;

    @Column({ nullable: true })
    security_guard_id!: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: "security_guard_id" })
    security_guard!: User;

    @Column({
        type: "varchar"
    })
    type!: ItemType;

    @Column({
        type: "varchar",
        default: ItemStatus.NEW
    })
    status!: ItemStatus;

    @Column()
    name!: string; // Visitor name or Parcel details

    @Column({ nullable: true })
    purpose!: string; // Purpose or description

    @Column({ nullable: true })
    media!: string; // File path/URL

    @Column({ nullable: true })
    vehicle_details!: string;

    @Column({ nullable: true })
    phone!: string; // Visitor phone number

    @Column({ nullable: true })
    courier_name!: string; // Parcel courier company

    @Column({ nullable: true })
    tracking_id!: string; // Parcel tracking ID

    @CreateDateColumn()
    created_at!: Date;
}
