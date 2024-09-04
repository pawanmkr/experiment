import {
    Controller,
    Post,
    Body,
    UploadedFile,
    UseInterceptors,
    HttpCode,
    Param,
    Query,
    Get,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { CreateDocumentDto } from './dto/document.dto';
import { SendOtpDto, VerifyOtpDto } from './dto/other.dto';
import { User } from './models/user.model';
import { CreateUserDto } from './dto/user.dto';

@ApiTags('Driver')
@Controller('drivers')
export class AppController {
    constructor(private readonly appService: AppService) {}

    @ApiOperation({ summary: 'Create a new user and driver' })
    @ApiResponse({
        status: 201,
        description: 'User and driver created successfully.',
        type: User,
    })
    @ApiResponse({ status: 400, description: 'Invalid data provided.' })
    @ApiResponse({ status: 409, description: 'Phone number or Email already exists' })
    @Post()
    async createUserWithDriver(@Body() CreateUserDto: CreateUserDto) {
        return this.appService.createUser(CreateUserDto);
    }

    @ApiOperation({ summary: 'Send OTP to phone number' })
    @ApiResponse({ status: 202, description: 'OTP sent successfully.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    @Post('user/login/send-otp')
    @HttpCode(202)
    async sendOtp(@Body() sendOtpDto: SendOtpDto): Promise<void> {
        return this.appService.sendOtp(sendOtpDto.phone);
    }

    @ApiOperation({ summary: 'Verify OTP and get user information' })
    @ApiResponse({
        status: 200,
        description: 'OTP verified and user information returned.',
    })
    @ApiResponse({ status: 400, description: 'Invalid OTP.' })
    @Post('user/login/verify-otp')
    @HttpCode(200)
    async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
        return this.appService.verifyOtp(verifyOtpDto.phone, verifyOtpDto.code);
    }

    @ApiOperation({ summary: 'Upload document and extract text' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
                type: {
                    type: 'string',
                    example: 'passport',
                    description: 'Type of the document',
                },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'Document uploaded and processed successfully.',
    })
    @ApiResponse({ status: 400, description: 'Invalid document type' })
    @ApiResponse({ status: 404, description: 'No relevant information found' })
    @Post('drivers/:id/document/upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadDocument(
        @Param('id') driverId: number,
        @Body() dto: CreateDocumentDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return await this.appService.uploadDocument(dto, file, driverId);
    }

    @ApiOperation({ summary: 'Fetch all drivers' })
    @ApiResponse({
        status: 200,
        description: 'Drivers fetched successfully.',
        type: [User],
    })
    @Get()
    async fetchDrivers() {
        return this.appService.fetchAllDrivers();
    }

    @ApiOperation({ summary: 'Search for driver using phone number' })
    @ApiResponse({
        status: 200,
        description: 'Driver found successfully.',
        type: [User],
    })
    @ApiResponse({ status: 404, description: 'Driver not found.' })
    @Get('search')
    async searchDriver(@Query('phone') phone: string) {
        return this.appService.searchDriver(phone);
    }
}
