import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ description: 'User name', example: 'John Doe' })
    readonly name: string;

    @ApiProperty({ description: 'Driver phone number', example: '6280183034' })
    readonly phone: string;
}
