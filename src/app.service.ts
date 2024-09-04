import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { LlmOutputStructure, OpenAiService } from './openai.service';
import { CreateDocumentDto } from './dto/document.dto';
import { Otp } from './models/otp.model';
import { Document, DriverDocumentType } from './models/document.model';
import { Op, UniqueConstraintError } from 'sequelize';
import { faker } from '@faker-js/faker';
import { User } from './models/user.model';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class AppService {
    constructor(
        @InjectModel(User) private readonly userModel: typeof User,
        @InjectModel(Otp) private readonly otpModel: typeof Otp,
        @InjectModel(Document) private readonly documentModel: typeof Document,
        private readonly openAiService: OpenAiService,
    ) {}

    async createUser(dto: CreateUserDto) {
        try {
            return await this.userModel.create({
                name: dto.name,
                phone: dto.phone,
                role: 'driver',
                email: faker.internet.email(),
            });
        } catch (error) {
            if (error instanceof UniqueConstraintError) {
                throw new ConflictException('Phone number already exists');
            } else {
                throw error;
            }
        }
    }

    async sendOtp(phone: string): Promise<void> {
        const otpCode = '123456';
        const user = await this.userModel.findOne({ where: { phone } });
        await this.otpModel.create({ code: otpCode, userId: user.id });
    }

    async verifyOtp(phone: string, code: string) {
        const otp = await this.otpModel.findOne({ where: { code } });
        if (!otp) throw new Error('Invalid OTP');

        const user = await this.userModel.findByPk(otp.userId);
        if (user.phone !== phone) {
            throw new NotFoundException('Invalid phone number');
        }
        return user;
    }

    async uploadDocument(dto: CreateDocumentDto, file: Express.Multer.File, driverId: number) {
        let json: LlmOutputStructure | null = null;
        if (dto.type !== DriverDocumentType.PHOTO) {
            json = await this.openAiService.extractText(file.buffer.toString('base64'), dto.type);
            if (!json) {
                throw new Error('Invalid JSON');
            } else if (json.status === '400') {
                throw new BadRequestException('Invalid document type');
            } else if (json.status === '404') {
                throw new NotFoundException('No relevant information found');
            } else if (json.error) {
                throw new Error(json.error);
            }
        }
        const document = await this.documentModel.create({
            type: dto.type,
            details: json.data || null,
            driverId,
        });
        return document;
    }

    async fetchAllDrivers() {
        return await this.userModel.findAll({
            where: { role: 'driver' },
            include: [
                {
                    model: Document,
                    attributes: { exclude: ['createdAt', 'updatedAt', 'userId'] },
                },
            ],
            attributes: { exclude: ['createdAt', 'updatedAt'] },
        });
    }

    async searchDriver(phone: string) {
        const driver = await this.userModel.findOne({
            where: {
                role: 'driver',
                phone: {
                    [Op.like]: `%${phone}`,
                },
            },
            include: [
                {
                    model: Document,
                    attributes: { exclude: ['createdAt', 'updatedAt', 'userId'] },
                },
            ],
            attributes: { exclude: ['createdAt', 'updatedAt'] },
        });
        if (!driver) {
            throw new NotFoundException('Driver not found');
        }
        return driver;
    }
}
