import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Organization } from "./Organization";

@Entity()
export class Pet {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "varchar", length: 255 })
  description!: string;

  @Column({ type: "varchar", length: 255, enum: ["M", "F"] })
  gender!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  profilePhoto?: string;

  @Column({ type: "varchar", length: 255, array: true, nullable: true })
  photos?: string[];

  @Column({ type: "int" })
  age!: string;

  @Column({ type: "varchar", length: 255 })
  breed!: string;

  @Column("varchar", { array: true })
  traits!: string[];

  @Column({ type: "boolean", default: false })
  isAdopted?: boolean;

  @CreateDateColumn({ name: "created_at" })
  created_at?: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at?: Date;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: "organization_id" })
  organization!: Organization;
}
