import { useEffect } from 'react';
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";

// components
import WorkoutDetails from '../components/WorkoutDetails';
import WorkoutForm from '../components/WorkoutForm';

const Home = () => {
  const { workouts, dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!user?.token) return; 

      try {
        const response = await fetch('/api/workouts', {
          headers: { 'Authorization': `Bearer ${user.token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch workouts");

        const json = await response.json();
        dispatch({ type: 'SET_WORKOUTS', payload: json });
      } catch (error) {
        console.error("Error fetching workouts:", error);
      }
    };

    fetchWorkouts();
  }, [dispatch, user]); 

  return (
    <div className="home">
      <div className="workouts">
        {workouts?.map((workout) => (
          <WorkoutDetails key={workout._id} workout={workout} />
        ))}
      </div>
      <WorkoutForm />
    </div>
  );
};

export default Home;
