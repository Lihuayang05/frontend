import { useState } from 'react'
import { useWorkoutsContext } from '../hooks/useWorkoutsContext'

const WorkoutForm = () => {
  const { dispatch } = useWorkoutsContext()

  const [title, setTitle] = useState('')
  const [load, setLoad] = useState('')
  const [reps, setReps] = useState('')
  const [error, setError] = useState(null)
  const [emptyFields, setEmptyFields] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const workout = { title, load, reps }

    try {
      const response = await fetch(`${process.env.REACT_API_URL}/api/workouts`, {
        method: 'POST',
        body: JSON.stringify(workout),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      // Check if the response is valid JSON
      const responseText = await response.text()

      if (!response.ok) {
        try {
          const errorJson = JSON.parse(responseText)
          setError(errorJson.error)
          setEmptyFields(errorJson.emptyFields)
        } catch (err) {
          // Handle case where the error message is not valid JSON
          setError('An error occurred. Please try again.')
        }
        return
      }

      // Handle valid response
      const json = JSON.parse(responseText)
      setEmptyFields([])
      setError(null)
      setTitle('')
      setLoad('')
      setReps('')
      dispatch({ type: 'CREATE_WORKOUT', payload: json })
      
    } catch (err) {
      // This will catch fetch errors (e.g., network errors)
      console.error('Error during the fetch operation:', err)
      setError('An unexpected error occurred. Please try again.')
    }
  }

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a New Workout</h3>

      <label>Exercise Title:</label>
      <input 
        type="text" 
        onChange={(e) => setTitle(e.target.value)} 
        value={title}
        className={emptyFields.includes('title') ? 'error' : ''}
      />

      <label>Load (in kg):</label>
      <input 
        type="number" 
        onChange={(e) => setLoad(e.target.value)} 
        value={load}
        className={emptyFields.includes('load') ? 'error' : ''}
      />

      <label>Number of Reps:</label>
      <input 
        type="number" 
        onChange={(e) => setReps(e.target.value)} 
        value={reps}
        className={emptyFields.includes('reps') ? 'error' : ''}
      />

      <button>Add Workout</button>
      {error && <div className="error">{error}</div>}
    </form>
  )
}

export default WorkoutForm
