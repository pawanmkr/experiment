import { ApiProperty } from '@nestjs/swagger';
import { DriverDocumentType } from 'src/models/document.model';

export class CreateDocumentDto {
    @ApiProperty({
        description: 'Type of the document',
        example: DriverDocumentType.DRIVING_LICENSE,
        enum: DriverDocumentType,
    })
    readonly type: DriverDocumentType;
}

export class UpdateDocumentDto {
    readonly type: string;
}
