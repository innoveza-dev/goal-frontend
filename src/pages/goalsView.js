import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const GoalsView = () => {
  const navigate = useNavigate();
  const { year } = useParams();
  const [goals, setGoals] = useState(null);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(
          `${API_BASE_URL}/api/goals`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setGoals(data.filter((g) => g.year?.toString() === year));
      } catch (e) {
        setGoals([]);
      }
    };
    fetchGoals();
  }, [year]);

  if (!Array.isArray(goals)) {
    return <div className="container my-4">Loading...</div>;
  }

  return (
    <div className="container my-4">
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
        &larr; Back
      </button>
      {goals.length === 0 ? (
        <div className="card p-4 text-center">No goals for this year.</div>
      ) : (
        <>
          <div className="p-4 mb-4 text-center">
            <h4 className="text-primary fw-bold mb-0" style={{ fontSize: '2rem' }}>
              {goals[0]?.year} : {goals[0]?.mainTitle?.toUpperCase()} <span className="text-secondary"></span>
            </h4>
          </div>
          {goals.map((goal, idx) => {
            let points = [];
            if (Array.isArray(goal.points)) {
              points = goal.points;
            } else if (typeof goal.points === 'string') {
              try {
                points = JSON.parse(goal.points);
                if (!Array.isArray(points)) points = [];
              } catch {
                points = [];
              }
            }

            let images = [];
            if (Array.isArray(goal.imageURL)) {
              images = goal.imageURL;
            } else if (typeof goal.imageURL === 'string') {
              try {
                images = JSON.parse(goal.imageURL);
                if (!Array.isArray(images)) images = [];
              } catch {
                images = [];
              }
            }

            return (
              <div key={goal._id || goal.id || idx} className="card mb-3 p-4 shadow-sm">
                <div className="mb-3 text-center">
                  <h5 className="fw-bold mb-0" style={{ fontSize: '1.3rem' }}>
                    {goal.title}
                  </h5>
                </div>
                <div className="mb-2">
                  <strong>Points:</strong>
                </div>
                <ul>
                  {points.length === 0 ? (
                    <li className="text-muted">No points</li>
                  ) : (
                    points.map((pt, i) => <li key={i}>{pt}</li>)
                  )}
                </ul>
                {images.length > 0 && (
                  <div className="d-flex gap-2 mt-2 flex-wrap justify-content-center">
                    {images.map((img, i) =>
                      img ? (
                        <img
                          key={i}
                          src={`${API_BASE_URL
                          }/uploads/${img}`}
                          alt="goal"
                          style={{
                            width: 100,
                            height: 80,
                            objectFit: 'cover',
                            borderRadius: 6,
                          }}
                        />
                      ) : null
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default GoalsView;
