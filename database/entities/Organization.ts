import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: "varchar", length: 255 })
  email!: string;

  @Column({ type: "varchar", length: 255 })
  password_hash?: string;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "bigint", })
  cnpj!: number;

  @Column({ type: "bigint", })
  whatsapp!: number;

  @Column({ type: "bigint", })
  cep!: number;

  @Column({ type: "varchar", length: 255 })
  city!: string;

  @Column({ type: "varchar", length: 255 })
  state!: string;

  @Column({ type: "varchar", length: 255 })
  street!: string;

  @Column({ type: "varchar", length: 255 })
  country!: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at?: Date;
}