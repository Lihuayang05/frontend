import { useState } from 'react';
import { useWorkoutsContext } from '../hooks/useWorkoutsContext';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

const WorkoutDetails = ({ workout }) => {
  const { dispatch } = useWorkoutsContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false); // New state to track completion
  const [editedWorkout, setEditedWorkout] = useState({
    title: workout.title,
    load: workout.load,
    reps: workout.reps,
  });

  const handleClick = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}api/workouts/ + workout._id`, {
      method: 'DELETE',
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: 'DELETE_WORKOUT', payload: json });
    }
  };

  const handleEditToggle = () => {
    setEditedWorkout({
      title: workout.title,
      load: workout.load,
      reps: workout.reps,
    });
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedWorkout({ ...editedWorkout, [name]: value });
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/workouts/' + workout._id, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedWorkout),
      });

      if (response.ok) {
        const updatedWorkout = await response.json();

        // Update the context with the new workout immediately
        dispatch({ type: 'UPDATE_WORKOUT', payload: updatedWorkout });

        setIsEditing(false); // Exit editing mode
      } else {
        console.error('Error updating workout:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to update workout:', error);
    }
  };

  const handleCardClick = () => {
    setIsCompleted(!isCompleted); // Toggle the completion status
  };

  return (
    <div 
      className={`workout-details ${isCompleted ? 'completed' : ''}`} 
      onClick={handleCardClick}
    >
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
          <h4 className={isCompleted ? 'completed' : ''}>{workout.title}</h4>
          <p className={isCompleted ? 'completed' : ''}>
            <strong>Load (kg): </strong>
            {workout.load}
          </p>
          <p className={isCompleted ? 'completed' : ''}>
            <strong>Number of reps: </strong>
            {workout.reps}
          </p>
          <p className={isCompleted ? 'completed' : ''}>
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
