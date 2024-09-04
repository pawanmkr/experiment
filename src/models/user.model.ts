import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Document } from './document.model';
import { ApiProperty } from '@nestjs/swagger';

@Table
export class User extends Model<User> {
    @ApiProperty({ description: 'User ID', example: 1 })
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ApiProperty({ description: 'User name', example: 'John Doe', required: true })
    @Column({ type: DataType.STRING })
    name: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    email: string;

    @ApiProperty({ description: 'User phone number', example: '6280183034', required: true })
    @Column({
        type: DataType.STRING,
        unique: true,
    })
    phone: string;

    @ApiProperty({
        description: 'User role',
        example: 'driver',
        enum: ['driver', 'admin'],
    })
    @Column({
        type: DataType.STRING,
        defaultValue: 'driver',
    })
    role: string;

    @ApiProperty({ type: Document, isArray: true })
    @HasMany(() => Document)
    documents: Document[];
}
