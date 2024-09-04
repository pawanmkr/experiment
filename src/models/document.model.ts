import { Table, Column, Model, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { User } from './user.model';
import { ApiProperty } from '@nestjs/swagger';

export enum DriverDocumentType {
    DRIVING_LICENSE = 'DRIVING_LICENSE',
    PAN_CARD = 'PAN_CARD',
    AADHAR_CARD = 'AADHAR_CARD',
    SCHOOL_CERTIFICATE = 'SCHOOL_CERTIFICATE',
    ADDRESS_PROOF = 'ADDRESS_PROOF',
    PHOTO = 'PHOTO',
}

@Table
export class Document extends Model<Document> {
    @ApiProperty({ description: 'Document ID', example: 1 })
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ApiProperty({
        description: 'Document type',
        example: DriverDocumentType.AADHAR_CARD,
        enum: DriverDocumentType,
        required: true,
    })
    @Column(DataType.TEXT)
    type: string;

    @ApiProperty({
        description: 'Document details in Object',
        example: {
            number: '1234567890',
            name: 'Hail Bahafi',
            date: '2021-01-01',
        },
    })
    @Column({
        type: DataType.JSON,
        allowNull: true,
    })
    details: Record<string, any> | null;

    @ForeignKey(() => User)
    @Column(DataType.INTEGER)
    driverId: number;

    @BelongsTo(() => User)
    driver: User;
}
