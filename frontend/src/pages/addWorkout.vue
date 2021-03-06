<template>
  <q-page padding>
    <div class="column items-center">
      <h4>Strength Workout</h4>
      <div v-if="this.workouts" class="column items-center">
        <q-toggle v-model="showLastWorkout" label="Show last workout" />
        <div v-if="showLastWorkout && this.workouts.length !== 0">
          <div
            v-for="(exercise, index) in oldWorkout"
            v-bind:key="`exercise-${index}`"
          >
            <exercise
              :index="index"
              :exercise="exercise"
              :emitValues="emitOldWorkoutValues"
              v-on:saveExercise="saveExercise"
              v-on:removeExercise="removeExercise"
            ></exercise>
            <q-separator />
          </div>
        </div>
        <div v-else-if="this.workouts.length === 0 && showLastWorkout">
          <h5>No previous workouts found</h5>
        </div>
        <div v-else>
          <div
            v-for="(exercise, index) in newWorkout"
            v-bind:key="`exercise-${index}$-{index}`"
          >
            <exercise
              :index="index"
              :exercise="exercise"
              :emitValues="emitNewWorkoutValues"
              v-on:saveExercise="saveExercise"
              v-on:removeExercise="removeExercise"
            ></exercise>
            <q-separator spaced />
          </div>
        </div>
        <q-btn
          style="margin: 1em; width: 4em; height: 4em"
          round
          color="primary"
          icon="add"
          @click="addNewWorkout"
        />
        <q-separator style="height: 1px" />
        <q-btn
          style="margin: 2em"
          color="primary"
          label="Submit"
          @click="setEmitValuesTrue"
        />
      </div>
      <div v-else class="full-width row flex-center text-accent q-gutter-sm">
        <q-icon size="2em" name="sentiment_dissatisfied" />
        <span>
          The server is not responding or you have no active internet
          connection. Please try again later.
        </span>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex';
import { ExerciseModelBuilder } from '../models/exerciseModel';
export default {
  name: 'add_workout',
  data() {
    return {
      oldWorkout: [],
      newWorkout: [],
      emitNewWorkoutValues: false,
      emitOldWorkoutValues: false,
      showLastWorkout: false,
      workoutToStore: [],
      successMessage: '',
      errorMessage: '',
    };
  },
  mounted() {
    /* if (this.exercises === undefined) { */
    /*   this.$store.dispatch('exercise/loadExercises', this).catch(error => { */
    /*     this.$q.notify({ message: error.message, color: 'red' }); */
    /*   }); */
    /* } */
    /* if (!this.workouts) { */
    /*   this.$store */
    /*     .dispatch('workouts/loadWorkouts', this) */
    /*     .then(() => { */
    /*       if (this.workouts.length !== 0) { */
    /*         const deepCloneWorkout = this.workouts[ */
    /*           this.workouts.length - 1 */
    /*         ].deepClone(); */
    /*         this.oldWorkout = deepCloneWorkout.getExercises(); */
    /*       } */
    /*     }) */
    /*     .catch(error => { */
    /*       this.$q.notify({ message: error.message, color: 'red' }); */
    /*     }); */
    /* } else { */
    if (this.workouts && this.workouts.length !== 0) {
      const deepCloneWorkout = this.workouts[
        this.workouts.length - 1
      ].deepClone();
      this.oldWorkout = deepCloneWorkout.getExercises();
    }
    /* } */
    const exerciseModelBuilder = new ExerciseModelBuilder();
    this.newWorkout = [
      exerciseModelBuilder.buildEmptyExerciseModel(),
      exerciseModelBuilder.buildEmptyExerciseModel(),
      exerciseModelBuilder.buildEmptyExerciseModel(),
      exerciseModelBuilder.buildEmptyExerciseModel(),
      exerciseModelBuilder.buildEmptyExerciseModel(),
    ];
  },
  methods: {
    removeExercise: function(index) {
      if (this.showLastWorkout) {
        this.oldWorkout.splice(index, 1);
      } else {
        this.newWorkout.splice(index, 1);
      }
    },
    saveExercise: function({ exercise, index }) {
      this.$log.debug(`Index is ${index}`);
      this.$log.debug('saveExercise is called');
      this.$log.debug(exercise);
      this.workoutToStore.push(exercise);

      if (this.newWorkout !== null && !this.showLastWorkout) {
        if (index === this.newWorkout.length - 1) {
          this.handleExerciseValidationAndDispatch();
        }
      }

      if (this.workouts !== null && this.showLastWorkout) {
        if (index === this.oldWorkout.length - 1) {
          this.handleExerciseValidationAndDispatch();
        }
      }
    },
    handleExerciseValidationAndDispatch() {
      if (!this.validateWorkout(this.workoutToStore)) {
        this.$log.debug(`message is ${this.errorMessage}`);
        this.$q.notify({ message: this.errorMessage, color: 'red' });
        this.resetSubmitFields();
      } else {
        this.$store
          .dispatch('workouts/saveWorkout', {
            vm: this,
            workout: this.workoutToStore,
          })
          .then(() => {
            const successMessage = 'Successfully stored your workout';
            this.$q.notify({ message: successMessage, color: 'green' });
            this.resetSubmitFields();
          })
          .catch(error => {
            this.$q.notify({ message: error, color: 'red' });
            this.resetSubmitFields();
          });
      }
    },
    resetSubmitFields() {
      this.workoutToStore = [];
      this.emitOldWorkoutValues = false;
      this.emitNewWorkoutValues = false;
      this.errorMessage = '';
    },
    validateWorkout: function(workout) {
      const defaultErrorMessage =
        'You did not fill all the required fields, please fill exercise Name, Repetition and Weight';
      let validated = true;
      this.$log.debug('In validated');
      for (let i = 0; i < workout.length; i++) {
        const currentWorkout = workout[i];
        this.$log.debug('Current Workout', currentWorkout);
        if (
          currentWorkout.getExerciseDefinition() === null ||
          currentWorkout.getExerciseDefinition().name === '' ||
          currentWorkout.getExerciseDefinition().category === '' ||
          currentWorkout.getExerciseDefinition().name === null ||
          currentWorkout.getExerciseDefinition().category === null
        ) {
          this.$log.debug('ExerciseName is empty');
          this.errorMessage = defaultErrorMessage;
          validated = false;
          break;
        }
        if (
          currentWorkout.getRepetition().length === 0 ||
          currentWorkout.getRepetition() === null
        ) {
          this.errorMessage = defaultErrorMessage;
          validated = false;
          break;
        }
        if (
          currentWorkout.getWeight().length === 0 ||
          currentWorkout.getWeight() === null
        ) {
          this.errorMessage = defaultErrorMessage;
          validated = false;
          break;
        }
        if (
          currentWorkout.getWeight().length !==
          currentWorkout.getRepetition().length
        ) {
          this.errorMessage = 'Weight and Repetition count must match';
          validated = false;
          break;
        }
      }
      return validated;
    },
    setEmitValuesTrue: function() {
      if (this.workouts !== null && this.showLastWorkout) {
        this.emitOldWorkoutValues = true;
      } else {
        this.emitNewWorkoutValues = true;
      }
    },
    addNewWorkout: function() {
      const exerciseModelBuilder = new ExerciseModelBuilder();
      if (this.workouts !== null && this.showLastWorkout) {
        this.oldWorkout.push(exerciseModelBuilder.buildEmptyExerciseModel());
      } else {
        this.newWorkout.push(exerciseModelBuilder.buildEmptyExerciseModel());
      }
    },
  },
  computed: {
    ...mapState('exercise', ['exercises']),
    ...mapState('workouts', ['workouts']),
  },
};
</script>

<style lang="sass" scoped></style>
