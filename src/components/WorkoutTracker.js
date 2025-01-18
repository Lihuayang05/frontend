import { useEffect, useState } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";

const WorkoutTracker = () => {
  const { workouts } = useWorkoutsContext();
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalLoad: 0,
    avgReps: 0,
  });

  useEffect(() => {
    if (workouts && workouts.length > 0) {
      const totalWorkouts = workouts.length;
      const totalLoad = workouts.reduce((sum, workout) => sum + workout.load, 0);
      const totalReps = workouts.reduce((sum, workout) => sum + workout.reps, 0);
      const avgReps = totalReps / totalWorkouts;

      setStats({
        totalWorkouts,
        totalLoad,
        avgReps: avgReps.toFixed(1),
      });
    }
  }, [workouts]);

  return (
    <div className="workout-tracker-container">
      <div className="workout-tracker">
        <h3>Workout Tracker</h3>
        <div className="stats">
          <div className="stat-box">
            <h4>Total Workouts</h4>
            <p>{stats.totalWorkouts}</p>
          </div>
          <div className="stat-box">
            <h4>Total Load Lifted</h4>
            <p>{stats.totalLoad} kg</p>
            <div className="progress-bar">
              <div
                className="progress"
                style={{ width: `${(stats.totalLoad / 500) * 100}%` }} 
              ></div>
            </div>
          </div>
          <div className="stat-box">
            <h4>Average Reps/Workout</h4>
            <p>{stats.avgReps}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutTracker;
