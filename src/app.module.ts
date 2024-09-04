import chalk from 'chalk';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpenAiService } from './openai.service';
import { Otp } from './models/otp.model';
import { Document } from './models/document.model';
import { User } from './models/user.model';

// Workaround for dynamic import
async function getChalk(): Promise<typeof chalk> {
    const module = await (eval(`import('chalk')`) as Promise<any>);
    return module.default;
}

@Module({
    imports: [
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.PGHOST,
            username: process.env.PGUSER,
            password: process.env.PGPASSWORD,
            database: process.env.PGDATABASE,
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false,
                },
            },
            define: {
                underscored: true,
                timestamps: true,
                freezeTableName: true,
                deletedAt: true,
                paranoid: true,
            },
            models: [User, Otp, Document],
            logQueryParameters: true,
            benchmark: true,
            logging: async (sql, timing) => {
                const chalk = await getChalk();
                console.log(chalk.green(`\nElapsed Time: ${timing}ms`));
                console.log(chalk.dim(sql));
            },
            autoLoadModels: true,
            synchronize: true,
            retryAttempts: 0,
            retryDelay: 10000,
        }),
        SequelizeModule.forFeature([User, Otp, Document]),
    ],
    controllers: [AppController],
    providers: [AppService, OpenAiService],
})
export class AppModule {}
