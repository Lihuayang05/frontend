import { useState } from 'react';
import { useWorkoutsContext } from '../hooks/useWorkoutsContext';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

const WorkoutDetails = ({ workout }) => {
  const { dispatch } = useWorkoutsContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedWorkout, setEditedWorkout] = useState({
    title: workout.title,
    load: workout.load,
    reps: workout.reps,
  });

  // DELETE function
  const handleClick = async () => {
    try {
      const response = await fetch(`/api/workouts/${workout._id}`, {
        method: 'DELETE',
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: 'DELETE_WORKOUT', payload: json });
      } else {
        console.error('Failed to delete workout:', response.statusText);
      }
    } catch (error) {
      console.error('Error during deletion:', error);
    }
  };

  // Toggle edit mode
  const handleEditToggle = () => {
    setEditedWorkout({
      title: workout.title,
      load: workout.load,
      reps: workout.reps,
    });
    setIsEditing(!isEditing);
  };

  // Handle input changes for editing
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedWorkout({ ...editedWorkout, [name]: value });
  };

  // SAVE function for editing
  const handleSave = async () => {
    try {
      const response = await fetch(`/api/workouts/${workout._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedWorkout),
      });

      if (response.ok) {
        const updatedWorkout = await response.json();
        dispatch({ type: 'UPDATE_WORKOUT', payload: updatedWorkout });
        setIsEditing(false); // Exit edit mode
      } else {
        console.error('Error updating workout:', response.statusText);
      }
    } catch (error) {
      console.error('Error during update:', error);
    }
  };

  return (
    <div className="workout-details">
      {isEditing ? (
        <div className="editing-mode">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={editedWorkout.title}
            onChange={handleChange}
            placeholder="Enter title"
          />

          <label htmlFor="load">Load (kg):</label>
          <input
            type="number"
            id="load"
            name="load"
            value={editedWorkout.load}
            onChange={handleChange}
            placeholder="Enter load (kg)"
          />

          <label htmlFor="reps">Reps:</label>
          <input
            type="number"
            id="reps"
            name="reps"
            value={editedWorkout.reps}
            onChange={handleChange}
            placeholder="Enter number of reps"
          />

          <button onClick={handleSave} className="save-button">
            Save
          </button>
          <button onClick={handleEditToggle} className="cancel-button">
            Cancel
          </button>
        </div>
      ) : (
        <>
          <h4>{workout.title}</h4>
          <p>
            <strong>Load (kg): </strong>
            {workout.load}
          </p>
          <p>
            <strong>Number of reps: </strong>
            {workout.reps}
          </p>
          <p>
            {formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}
          </p>
          <span className="material-symbols-outlined" onClick={handleClick}>
            delete
          </span>
          <span className="material-symbols-outlined edit-button" onClick={handleEditToggle}>
            edit
          </span>
        </>
      )}
    </div>
  );
};

export default WorkoutDetails;
