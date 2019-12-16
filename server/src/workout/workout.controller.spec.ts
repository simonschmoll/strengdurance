import {Test, TestingModule} from '@nestjs/testing';
import {WorkoutController} from './workout.controller';
import {StrengthWorkoutService} from './strength_workout.service';
import {StrengthWorkout} from './interfaces/strength_workout';
import {StrengthWorkoutMockService, strengthWorkoutMockData} from '../mocks/strength_workout_mock';

describe('Workout Controller', () => {

        let controller: WorkoutController;
        let service: StrengthWorkoutService;
        beforeEach(async () => {
                const module: TestingModule = await Test.createTestingModule({
                        controllers: [WorkoutController],
                        providers: [{
                                provide: StrengthWorkoutService,
                                useValue: new StrengthWorkoutMockService(),
                        }]
                }).compile();

                controller = module.get<WorkoutController>(WorkoutController);
                service = module.get<StrengthWorkoutService>(StrengthWorkoutService);
        });

        it('should be defined', () => {
                expect(controller).toBeDefined();
        });

        it('getAllWorkouts should return all workouts when called', async () => {
                const spy = jest.spyOn(service, 'getAllStrengthWorkouts').mockImplementation(() => {
                        return new Promise<StrengthWorkout[]>((resolve) => resolve(strengthWorkoutMockData))
                });
                const actualResponse = await controller.getAllStrengthWorkouts();
                expect(spy).toBeCalledTimes(1);
                expect(actualResponse).toEqual(strengthWorkoutMockData);
        })

        it('createStrengthWorkout should return provided exercise when called', async () => {
                const spy = jest.spyOn(service, 'createStrengthWorkout').mockImplementation(() => {
                        return new Promise<StrengthWorkout>((resolve) => resolve(strengthWorkoutMockData[0]))
                });
                const actualResponse = await controller.createStrengthWorkout(strengthWorkoutMockData[0]);
                expect(spy).toBeCalledTimes(1);
                expect(actualResponse).toEqual(strengthWorkoutMockData[0]);
        })
});