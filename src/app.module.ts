import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { T } from './libs/types/common';
import { ComponentsModule } from './components/components.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      playground: true,
      uploads: false,
      autoSchemaFile: true,
      formatError: (error: T) => {
        const graphQLFormatedError = {
          code: error?.extensions.code,
          message:
            error?.extensions?.exception?.response?.message ||
            error?.extensions?.response?.message ||
            error?.message,
        };
        console.log('GRAPHQL GLOBALL ERROR ->', graphQLFormatedError);
        return graphQLFormatedError;
      },
    }),
    DatabaseModule,
    ComponentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
