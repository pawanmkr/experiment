import { ApiProperty } from '@nestjs/swagger';

export class SendOtpDto {
    @ApiProperty({
        description: 'Phone number to send OTP',
        example: '6280183034',
    })
    readonly phone: string;
}

export class VerifyOtpDto {
    @ApiProperty({ description: 'Phone number', example: '6280183034' })
    readonly phone: string;

    @ApiProperty({ description: 'OTP code', example: '123456' })
    readonly code: string;
}
