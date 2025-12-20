import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

export enum ItemType {
    VISITOR = "Visitor",
    PARCEL = "Parcel"
}

export enum ItemStatus {
    // Visitor statuses
    WAITING_FOR_APPROVAL = "WaitingForApproval",
    APPROVED = "Approved",
    REJECTED = "Rejected",
    ENTERED = "Entered",
    EXITED = "Exited",

    // Parcel statuses
    RECEIVED = "Received",
    NOTIFIED = "Notified",
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
        default: ItemStatus.WAITING_FOR_APPROVAL // Default, but typically set on creation
    })
    status!: ItemStatus;

    @Column({ nullable: true })
    description!: string; // Name of visitor or parcel details

    @CreateDateColumn()
    created_at!: Date;
}
