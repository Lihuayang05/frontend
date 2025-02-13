import { useState } from 'react';
import { useWorkoutsContext } from '../hooks/useWorkoutsContext';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

const WorkoutDetails = ({ workout }) => {
  const { dispatch } = useWorkoutsContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [editedWorkout, setEditedWorkout] = useState({
    title: workout.title,
    load: workout.load,
    reps: workout.reps,
  });
  const [isDeleted, setIsDeleted] = useState(false);

  const handleClick = async () => {
    if (!workout._id) {
      console.error('Workout ID is missing!');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workouts/${workout._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error deleting workout: ${errorText}`);
      }

      dispatch({ type: 'DELETE_WORKOUT', payload: workout._id });
      setIsDeleted(true);
      console.log('Workout deleted successfully!');
    } catch (error) {
      console.error(error.message);
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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workouts/${workout._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedWorkout),
      });

      if (response.ok) {
        const updatedWorkout = await response.json();
        dispatch({ type: 'UPDATE_WORKOUT', payload: updatedWorkout });
        setIsEditing(false);
      } else {
        const errorText = await response.text();
        throw new Error(`Error updating workout: ${errorText}`);
      }
    } catch (error) {
      console.error('Failed to update workout:', error);
    }
  };

  const handleCardClick = (e) => {
    if (e.target.tagName.toLowerCase() === 'span') return; 
    setIsCompleted((prev) => !prev);
  };

  if (isDeleted) return null;

  return (
    <div className={`workout-details ${isCompleted ? 'completed' : ''}`} onClick={handleCardClick}>
      {isEditing ? (
        <div className="editing-mode">
          <label htmlFor="title">Title:</label>
          <input type="text" id="title" name="title" value={editedWorkout.title} onChange={handleChange} placeholder="Enter title" />
          <label htmlFor="load">Load (kg):</label>
          <input type="number" id="load" name="load" value={editedWorkout.load} onChange={handleChange} placeholder="Enter load (kg)" />
          <label htmlFor="reps">Reps:</label>
          <input type="number" id="reps" name="reps" value={editedWorkout.reps} onChange={handleChange} placeholder="Enter number of reps" />
          <button onClick={handleSave} className="save-button">Save</button>
          <button onClick={handleEditToggle} className="cancel-button">Cancel</button>
        </div>
      ) : (
        <>
          <h4 className={isCompleted ? 'completed' : ''}>{workout.title}</h4>
          <p><strong>Load (kg): </strong>{workout.load}</p>
          <p><strong>Number of reps: </strong>{workout.reps}</p>
          <p>{formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}</p>
          <span className="material-symbols-outlined" onClick={handleClick}>delete</span>
          <span className="material-symbols-outlined edit-button" onClick={handleEditToggle}>edit</span>
        </>
      )}
    </div>
  );
};

export default WorkoutDetails;
