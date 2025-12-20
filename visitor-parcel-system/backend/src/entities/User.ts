import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

export enum UserRole {
    RESIDENT = "Resident",
    SECURITY = "Security",
    ADMIN = "Admin"
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    password_hash!: string;

    @Column({
        type: "varchar", // specific enum type not supported in sqlite
        default: UserRole.RESIDENT
    })
    role!: UserRole;

    @CreateDateColumn()
    created_at!: Date;
}
