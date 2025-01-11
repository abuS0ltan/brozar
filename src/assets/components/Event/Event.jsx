'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './event.css';

export default function Event() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [registering, setRegistering] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [participationStatus, setParticipationStatus] = useState(null);

  useEffect(() => {
    fetchEventDetails();
    checkUserRole();
    checkParticipationStatus();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/events/${id}`);
      setEvent(response.data);
      const coverImageIndex = response.data.images.findIndex((img) => img.isCover);
      setSelectedImage(coverImageIndex !== -1 ? coverImageIndex : 0);
    } catch (err) {
      setError('Failed to fetch event details. Please try again later.');
      console.error('Error fetching event details:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkUserRole = () => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && userData.role === 'owner') {
      setIsOwner(true);
    }
  };

  const checkParticipationStatus = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/events/${id}/my-participation`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      setParticipationStatus(response.data.status);
    } catch (err) {
      // If there's an error, it means the user is not a participant
      setParticipationStatus(null);
    }
  };

  const handleRegister = async () => {
    const additionalData = prompt('Would you like to provide additional information? (optional)');
    try {
      setRegistering(true);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/events/${id}/participate`,
        { additionalData },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      // Set initial status as pending right after registration
      setParticipationStatus('pending');
      alert('Successfully participated in the event!');
    } catch (err) {
      alert('Failed to participate in the event. Please try again.');
      console.error('Error participating in event:', err);
    } finally {
      setRegistering(false);
    }
  };

  const getParticipationStatusElement = () => {
    if (!isOwner && !participationStatus) {
      return (
        <button
          className="btn btn-primary btn-lg register-btn"
          onClick={handleRegister}
          disabled={registering}
        >
          {registering ? 'Registering...' : 'Share'}
        </button>
      );
    }

    if (isOwner && !participationStatus) {
      return (
        <button
          className="btn btn-success btn-lg register-btn"
          onClick={handleRegister}
          disabled={registering}
        >
          {registering ? 'Registering...' : 'Register Attendance'}
        </button>
      );
    }

    const statusStyles = {
      pending: { className: 'text-warning', text: 'Your participation is pending' },
      accepted: { className: 'text-success', text: 'Your participation has been accepted' },
      rejected: { className: 'text-danger', text: 'Your participation has been rejected' }
    };

    const status = statusStyles[participationStatus] || statusStyles.pending;
    return (
      <div className={`participation-status ${status.className} fs-5 fw-bold`}>
        {status.text}
      </div>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error || 'Event not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-7">
          <div className="event-gallery">
            <div className="main-image-container">
              <img
                src={event.images[selectedImage]?.imageUrl || 'default-image.jpg'}
                alt={event.name}
                className="main-image"
              />
            </div>
            <div className="thumbnails-container">
              {event.images.map((image, index) => (
                <div
                  key={image.id}
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image.imageUrl}
                    alt={`${event.name} thumbnail ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-5">
          <div className="event-details">
            <h1 className="event-title">{event.name}</h1>

            <div className="categories mb-3">
              <span className="category-tag">{event.category}</span>
            </div>

            <div className="location mb-3">
              <p className="text-muted mb-0">
                {event.city} - {event.street}
              </p>
            </div>

            <div className="date-time mb-4">
              <h5 className='d-inline-block'>{formatDate(event.startDate)}&nbsp;-</h5>
              <h5 className='d-inline-block'>&nbsp; {formatDate(event.endDate)}</h5>

              <p className="text-success mb-0">
                {formatTime(event.startDate)} - {formatTime(event.endDate)}
              </p>
            </div>
            <div className="event-status my-3">
              <span className={`status-badge status-${event.status}`}>
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </span>
            </div>

            {getParticipationStatusElement()}
          </div>
        </div>
      </div>
    </div>
  );
}