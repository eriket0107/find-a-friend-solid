import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Org } from "./Org";

@Entity()
export class Pet {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "varchar", length: 255 })
  description!: string;

  @Column({ type: "varchar", length: 255 })
  image_url!: string;

  @Column({ type: "int" })
  age!: string;

  @Column({ type: "varchar", length: 255 })
  breed!: string;

  @Column('varchar')
  traits!: string[];

  @CreateDateColumn({ name: 'created_at' })
  created_at?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at?: Date;

  @ManyToOne(() => Org, (org) => org.id)
  org_id!: string;
}
