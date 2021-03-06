"use strict";
exports.__esModule = true;
var exercise_schema_1 = require("../server/src/exercises/schemas/exercise.schema");
var exercise_data_1 = require("./exercise_data");
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/mongodb", {
    useNewUrlParser: true
});
var Exercise = mongoose.model("Exercise", exercise_schema_1.ExerciseSchema);
Exercise.deleteMany({}).then(function () {
    return console.log("Deleted all Exercises, ready for filling");
});
exercise_data_1["default"].forEach(function (exercise) {
    var exerciseModel = new Exercise({
        name: exercise.name,
        category: exercise.category
    });
    /* const model = Exercise.find(exerciseModel).then(() => console.log('Found model')); */
    /* console.log('model is', model); */
    exerciseModel
        .save()
        .then(function () { return console.log("It worked"); })["catch"](function () { return console.log("Did not work"); });
});
