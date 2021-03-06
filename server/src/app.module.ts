import {Module, HttpModule} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {MongooseModule} from '@nestjs/mongoose';
import {ExercisesModule} from './exercises/exercises.module';
import {ValidationPipe} from './validation/validation.pipes';
import {APP_PIPE} from '@nestjs/core';
import {WorkoutModule} from './workout/workout.module';
import {AuthModule} from './auth/auth.module';
import {UserModule} from './user/user.module';
import {ConfigModule} from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true}),
    HttpModule,
    ExercisesModule,
    WorkoutModule,
    AuthModule,
    UserModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().default(3000),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {
  constructor() {
    console.log(process.env.MONGO_URL);
  }
}
