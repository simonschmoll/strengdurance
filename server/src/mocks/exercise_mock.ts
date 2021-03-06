import {
  exerciseMockModelData,
  exerciseMockData,
  exerciseMockDataToObject,
} from '../mocks/exercise_mock_data';

// Very generic mock model, should be replaced with easy to maintain solution.
// Maybe just provide functions and then let jest handle the mock implementation.
export default class ExerciseMockModel {
  static _id: number = 0;
  static saveCount: number = 0;
  static findCount: number = 0;
  static selectCount: number = 0;
  static findOneCount: number = 0;
  static deleteOneCount: number = 0;
  static execCount: number = 0;
  static orCount: number = 0;
  static findParams: Object = undefined;
  constructor() {}
  save() {
    ExerciseMockModel.saveCount += 1;
    return exerciseMockDataToObject;
  }
  static find(params) {
    this.findCount += 1;
    this.findParams = params;
    return this;
  }
  static select() {
    this.selectCount += 1;
    return this;
  }
  static or() {
    this.orCount += 1;
    return this;
  }
  static findOne() {
    this.findOneCount += 1;
    return this;
  }
  static deleteOne() {
    this.deleteOneCount += 1;
    return this;
  }
  static exec(): Promise<any> {
    this.execCount += 1;
    return new Promise(resolve => resolve(exerciseMockModelData));
  }
  static reset() {
    this.execCount = 0;
    this.findOneCount = 0;
    this.deleteOneCount = 0;
    this.selectCount = 0;
    this.findCount = 0;
    this.saveCount = 0;
    this.orCount = 0;
    this.findParams = undefined;
  }
}
