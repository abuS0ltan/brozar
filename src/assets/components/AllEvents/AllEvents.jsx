import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './all-events.css';

function AllEvents() {
    const [projects, setProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/events`);
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
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) 
    );

    return (
        <div className="all-events-container">
            <div className="hero-section text-center py-5">
                <h1 className="display-2 mb-3 title">Event</h1>
                <p className="lead text-muted mb-5 px-3 subtitle">
                Discover and support innovative Palestinian events. Explore exciting gatherings, connect with organizers, and participate in local experiences.
                </p>
                <div className="search-bar d-flex justify-content-center mb-5">
                    <div className="search-input position-relative">
                        <input
                            type="text"
                            className="form-control form-control-lg"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="btn btn-success search-button">Search</button>
                    </div>
                </div>
            </div>

            <div className="container pb-5 mt-5 py-5">
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
                            <div key={project.id} className="col-12 col-md-6 col-lg-3">
                                <div className="card project-card">
                                    <img
                                        src={project.images && project.images.length > 0 ? project.images[0].imageUrl : '/path/to/default-image.jpg'}
                                        className="card-img-top project-image"
                                        alt={project.name}
                                    />
                                    <div className="card-body text-start">
                                        <h5 className="card-title mb-2">{project.name}</h5>
                                        <p className="card-text text-muted mb-1">{project.startDate}</p>

                                        <p className="card-text text-muted mb-1">{project.city}</p>
                                        <Link to={`/event/${project.id}`} className=" details-button">
                                            Show more &rarr;	
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

export default AllEvents;
