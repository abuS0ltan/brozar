import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './owner-profile.css'
export default function OwnerProfile() {
  const { id } = useParams(); // جلب الـ ID من العنوان
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) {
        setError('User ID not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/owners/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setProfile(response.data);
      } catch (err) {
        setError('Failed to load profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) {
    return <div className="container my-5 alert alert-primary text-center m-auto p-4">Loading...</div>;
  }

  if (error || !profile) {
    return <div className=" container my-5 alert alert-danger text-center error-text p-4">{error || 'Profile not found'}</div>;
  }

  const age = new Date().getFullYear() - new Date(profile.birthDate).getFullYear();

  return (
    <>
    
        <div className="info mb-5">

            <div className="container ">
                <div className=" px-5">

            <div className="row">
                <div className="col-4">
                <img
                        src={profile.photo || 'https://media.istockphoto.com/id/1223671392/vector/default-profile-picture-avatar-photo-placeholder-vector-illustration.jpg?s=612x612&w=0&k=20&c=s0aTdmT5aU6b8ot7VKm11DeID6NctRCpB755rA1BIP0='}
                        alt={`${profile.user.firstName} ${profile.user.lastName}`}
                        className="profile-image"
                    />
                </div>
                <div className="col-md-8 mx-auto">
                <div className="profile-container px-3">
                    <div className="profile-header">
                    
                    <div className="profile-info px-5">
                        <h1 className="profile-name text-capitalize fw-bolder">
                        {profile.user.firstName} {profile.user.lastName}
                        </h1>
                        <div className="profile-details fw-bolder">Age: {age}</div>
                        <p className="profile-bio">{profile.bio}</p>
                    </div>
                    </div>
                </div>
                </div>
            </div>
                </div>
            </div>
        </div>
        {/* <div className="project">
            <div className="container">
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
            </div>
        </div> */}
    </>
  );
}
