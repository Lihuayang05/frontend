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
      // Make sure the API URL is correct and not undefined
      const apiUrl = process.env.REACT_APP_API_URL
      if (!apiUrl) {
        setError('API URL is not defined.')
        return
      }

      const response = await fetch(`${apiUrl}/api/workouts`, {
        method: 'POST',
        body: JSON.stringify(workout),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const responseText = await response.text() // Get raw response as text

      if (!response.ok) {
        // If the response is not OK (404 or 500), handle it here
        setError(`Error: ${responseText || 'An unexpected error occurred.'}`)
        setEmptyFields([])
        return
      }

      // Handle valid response
      try {
        const json = JSON.parse(responseText)
        setEmptyFields([])
        setError(null)
        setTitle('')
        setLoad('')
        setReps('')
        dispatch({ type: 'CREATE_WORKOUT', payload: json })
      } catch (err) {
        setError('Failed to parse response. The server might have sent an unexpected format.')
      }

    } catch (err) {
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
