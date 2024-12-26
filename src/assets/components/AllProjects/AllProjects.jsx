import React from 'react'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
function AllProjects() {
    const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
        console.log(localStorage.getItem('token'))
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/projects`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setProjects(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch projects. Please try again later.');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.shortInfo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Hero Section */}
      <div className="text-center py-5">
        <h1 className="display-2 mb-3" style={{ color: '#4CAF50' }}>Project</h1>
        <p className="lead text-muted mb-5 px-3" style={{ maxWidth: '800px', margin: '0 auto' }}>
          Discover and support innovative Palestinian projects. Search for businesses, 
          connect with entrepreneurs, and invest in local talent
        </p>
        
        {/* Search Bar */}
        <div className="d-flex justify-content-center mb-5">
          <div className="position-relative" style={{ maxWidth: '600px', width: '100%' }}>
            <input
              type="text"
              className="form-control form-control-lg pe-5"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                borderRadius: '25px',
                paddingLeft: '1.5rem',
                border: '1px solid #ddd'
              }}
            />
            <button 
              className="btn btn-success px-4"
              style={{
                position: 'absolute',
                right: '5px',
                top: '5px',
                borderRadius: '20px'
              }}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="container pb-5">
        {loading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : (
          <div className="row g-4">
            {filteredProjects.map(project => (
              <div key={project.id} className="col-12 col-md-6 col-lg-4">
                <div 
                  className="card h-100 border-0 shadow-sm" 
                  style={{ 
                    borderRadius: '15px',
                    transition: 'transform 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <img
                    src={project.imageUrl}
                    className="card-img-top"
                    alt={project.name}
                    style={{ 
                      height: '200px',
                      objectFit: 'cover',
                      borderTopLeftRadius: '15px',
                      borderTopRightRadius: '15px'
                    }}
                  />
                  <div className="card-body text-center">
                    <h5 className="card-title mb-2">{project.name}</h5>
                    <Link 
                      to={`/project/${project.id}`}
                      className="btn btn-success px-4"
                      style={{ borderRadius: '20px' }}
                    >
                      DETAILS
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AllProjects