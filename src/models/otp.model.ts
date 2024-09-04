import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import { User } from './user.model';

@Table
export class Otp extends Model<Otp> {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @Column(DataType.TEXT)
    code: string;

    @ForeignKey(() => User)
    @Column(DataType.TEXT)
    userId: number;
}
