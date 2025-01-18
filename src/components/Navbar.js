import { Link } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  // State to track which days are marked as done
  const [completedDays, setCompletedDays] = useState([]);

  // Function to handle day click (toggle completion)
  const handleDayClick = (day) => {
    setCompletedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <header>
      <div className="container">
        <Link to="/">
          <h1>Workout Buddy</h1>
        </Link>

        <div className="week-days">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
            <div
              key={index}
              className={`day-circle ${completedDays.includes(day) ? 'completed' : ''}`}
              onClick={() => handleDayClick(day)}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
