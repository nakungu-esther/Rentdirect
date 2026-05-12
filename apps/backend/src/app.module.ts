import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ServeStaticModule } from '@nestjs/serve-static';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { join } from 'path';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ListingsModule } from './listings/listings.module';
import { PaymentsModule } from './payments/payments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { UploadsModule } from './uploads/uploads.module';
import { PlatformModule } from './platform/platform.module';
import { RentalsModule } from './rentals/rentals.module';
import { ContractsModule } from './contracts/contracts.module';
import { MessagingModule } from './messaging/messaging.module';
import { LocationMapModule } from './location-map/location-map.module';
import { GovernmentIntegrationsModule } from './government-integrations/government-integrations.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ModerationModule } from './moderation/moderation.module';
import { ReportingModule } from './reporting/reporting.module';
import { SettingsModule } from './settings/settings.module';
import { SupportModule } from './support/support.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { AiModule } from './ai/ai.module';
import { BlockchainModule } from './blockchain/blockchain.module';

import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import { getNestTypeOrmModuleOptions } from './database/typeorm.config';

@Module({
  imports: [
    // ── Config ────────────────────────────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig],
      envFilePath: '.env',
    }),

    // ── Database ──────────────────────────────────────────────────────────
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => getNestTypeOrmModuleOptions(),
    }),

    // ── Rate limiting ─────────────────────────────────────────────────────
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),

    // ── Serve uploaded files statically ───────────────────────────────────
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),

    // ── Feature modules ───────────────────────────────────────────────────
    AuthModule,
    UsersModule,
    ListingsModule,
    PaymentsModule,
    NotificationsModule,
    UploadsModule,
    PlatformModule,
    RentalsModule,
    ContractsModule,
    MessagingModule,
    LocationMapModule,
    GovernmentIntegrationsModule,
    AnalyticsModule,
    ModerationModule,
    ReportingModule,
    SettingsModule,
    SupportModule,
    AuditLogsModule,
    AiModule,
    BlockchainModule,
  ],
  providers: [
    { provide: APP_GUARD,       useClass: JwtAuthGuard },
    { provide: APP_GUARD,       useClass: ThrottlerGuard },
    { provide: APP_FILTER,      useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
  ],
})
export class AppModule {}
