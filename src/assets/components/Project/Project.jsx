'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './event.css';

export default function Project() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/projects/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setProject(response.data);
      setSelectedImage(0); // Initial selected image
    } catch (err) {
      setError('Failed to fetch project details. Please try again later.');
      console.error('Error fetching project details:', err);
    } finally {
      setLoading(false);
    }
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

  if (error || !project) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error || 'Project not found'}
        </div>
      </div>
    );
  }

  const handleOwnerClick = () => {
    navigate(`/owner/${project.owner.id}`);
  };

  return (
    <div className="container mt-5 project">
      <div className="row">
        <div className="col-md-7">
          <div className="event-gallery">
            <div className="main-image-container">
              <img
                src={project.images[selectedImage]?.imageUrl || 'default-image.jpg'}
                alt={project.name}
                className="main-image"
              />
            </div>
            <div className="thumbnails-container">
              {project.images.map((image, index) => (
                <div
                  key={index}
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={image.imageUrl} alt={`${project.name} thumbnail ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-5">
          <div className="event-details">
            <h1 className="event-title">{project.name}</h1>
            <div className="owner mb-3">
              <p>
                Owned by:{' '}
                <span
                  className=" cursor-pointer"
                  onClick={handleOwnerClick}
                >
                  {project.owner.user.firstName} {project.owner.user.lastName}
                </span>
              </p>
            </div>

            <div className="categories mb-3">
              <span className="category-tag">{project.category}</span>
            </div>
            
            <div className="location mb-3">
              <p className="text-muted mb-0">
                {project.city} - {project.street}
              </p>
            </div>
            <div className="location mb-3">
              <p className="text-muted mb-0">
                {project.description}
              </p>
            </div>
            

            <div className="contact-info mb-4">
              <p className='icon'>
<span className='pe-2'>
  <svg width="23" height="16" viewBox="0 0 23 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19.75 0.5H3.25C2.52065 0.5 1.82118 0.774842 1.30545 1.26407C0.789729 1.75329 0.5 2.41683 0.5 3.1087V12.8913C0.5 13.5832 0.789729 14.2467 1.30545 14.7359C1.82118 15.2252 2.52065 15.5 3.25 15.5H19.75C20.4793 15.5 21.1788 15.2252 21.6945 14.7359C22.2103 14.2467 22.5 13.5832 22.5 12.8913V3.1087C22.5 2.41683 22.2103 1.75329 21.6945 1.26407C21.1788 0.774842 20.4793 0.5 19.75 0.5ZM19.4956 4.91521L11.9331 10.7848C11.8106 10.879 11.6577 10.9305 11.5 10.9305C11.3423 10.9305 11.1894 10.879 11.0669 10.7848L3.50438 4.91521C3.4242 4.86488 3.35604 4.79916 3.3043 4.72229C3.25257 4.64543 3.2184 4.55912 3.204 4.46895C3.18961 4.37878 3.19532 4.28674 3.22076 4.19879C3.24619 4.11084 3.29079 4.02893 3.35167 3.95834C3.41255 3.88776 3.48835 3.83008 3.5742 3.78901C3.66004 3.74795 3.75401 3.72442 3.85003 3.71995C3.94605 3.71547 4.042 3.73015 4.13167 3.76304C4.22134 3.79593 4.30274 3.84629 4.37062 3.91088L11.5 9.4413L18.6294 3.91088C18.7714 3.82172 18.9433 3.78575 19.1117 3.80993C19.2801 3.83411 19.433 3.91673 19.5409 4.04178C19.6487 4.16682 19.7038 4.32537 19.6954 4.48674C19.6871 4.64811 19.6159 4.8008 19.4956 4.91521Z" fill="url(#paint0_linear_41_1195)"/>
<defs>
<linearGradient id="paint0_linear_41_1195" x1="11.5" y1="0.5" x2="11.5" y2="15.5" gradientUnits="userSpaceOnUse">
<stop stop-color="#4CAF4F"/>
<stop offset="1" stop-color="#10DC17"/>
</linearGradient>
</defs>
</svg>
</span>
<a href={`mailto:${project.contact.email}`}>{project.contact.email}</a>
</p>
              <p className='icon'> 
                <span className='pe-2'>
                <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18.9683 6.01068C17.4555 7.01422 15.7889 7.75402 14.0372 8.19967C14.0935 8.95055 14.1247 9.72051 14.1247 10.4841C14.1247 11.4959 14.0747 12.514 13.981 13.494C15.6414 13.9124 17.2273 14.593 18.6808 15.5112C19.4935 14.0742 19.945 12.4551 19.9951 10.7976C20.0453 9.14023 19.6926 7.49587 18.9683 6.01068Z" fill="url(#paint0_linear_41_1221)"/>
<path d="M10 7.32151C10.8548 7.31903 11.7079 7.24238 12.5499 7.09242C12.0937 3.10897 10.8875 0.697266 10 0.697266C9.11254 0.697266 7.90008 3.10897 7.44385 7.09242C8.28796 7.24265 9.14311 7.3193 10 7.32151Z" fill="url(#paint1_linear_41_1221)"/>
<path d="M7.32511 8.48602C7.28136 9.12236 7.25635 9.79052 7.25635 10.4841C7.25635 11.4577 7.30635 12.3613 7.38135 13.214C9.11705 12.9171 10.8892 12.9171 12.6249 13.214C12.6999 12.3613 12.7499 11.4577 12.7499 10.4841C12.7499 9.79052 12.7499 9.12236 12.6874 8.48602C11.8012 8.63571 10.9046 8.71233 10.0063 8.71511C9.10781 8.71578 8.21089 8.63914 7.32511 8.48602Z" fill="url(#paint2_linear_41_1221)"/>
<path d="M18.2933 4.81439C16.8209 2.58547 14.5431 1.03931 11.9561 0.512756C12.9373 1.84906 13.5935 4.17169 13.906 6.80612C15.4635 6.38484 16.9446 5.71242 18.2933 4.81439Z" fill="url(#paint3_linear_41_1221)"/>
<path d="M10 14.3912C9.175 14.3937 8.35152 14.4639 7.5376 14.6012C8.05008 18.1519 9.16255 20.2709 10 20.2709C10.8375 20.2709 11.9437 18.1519 12.4624 14.6012C11.6485 14.4644 10.825 14.3942 10 14.3912Z" fill="url(#paint4_linear_41_1221)"/>
<path d="M2.08154 16.682C3.54996 18.6501 5.67139 20.0071 8.05011 20.5C7.16264 19.2846 6.53766 17.2611 6.17517 14.9257C4.73204 15.2994 3.35213 15.8914 2.08154 16.682Z" fill="url(#paint5_linear_41_1221)"/>
<path d="M11.9561 20.4682C14.3325 19.9739 16.4515 18.617 17.9184 16.6502C16.6441 15.852 15.2602 15.2515 13.8122 14.8684C13.4685 17.2292 12.8498 19.2528 11.9561 20.4682Z" fill="url(#paint6_linear_41_1221)"/>
<path d="M5.88764 10.4841C5.88764 9.72053 5.88762 8.95057 5.96887 8.1997C4.21495 7.75161 2.54642 7.0097 1.03153 6.00433C0.307241 7.49178 -0.0454587 9.13817 0.00468958 10.7976C0.0548379 12.457 0.50628 14.0783 1.31902 15.5175C2.77375 14.5958 4.36189 13.913 6.02514 13.494C5.93139 12.5141 5.88764 11.4959 5.88764 10.4841Z" fill="url(#paint7_linear_41_1221)"/>
<path d="M8.0502 0.5C5.46111 1.02968 3.18292 2.58063 1.71289 4.81435C3.05745 5.71319 4.53432 6.38772 6.08775 6.81245C6.41274 4.17802 7.06898 1.8363 8.0502 0.5Z" fill="url(#paint8_linear_41_1221)"/>
<defs>
<linearGradient id="paint0_linear_41_1221" x1="16.9904" y1="6.01068" x2="16.9904" y2="15.5112" gradientUnits="userSpaceOnUse">
<stop stop-color="#4CAF4F"/>
<stop offset="1" stop-color="#10DC17"/>
</linearGradient>
<linearGradient id="paint1_linear_41_1221" x1="9.99688" y1="0.697266" x2="9.99688" y2="7.32151" gradientUnits="userSpaceOnUse">
<stop stop-color="#4CAF4F"/>
<stop offset="1" stop-color="#10DC17"/>
</linearGradient>
<linearGradient id="paint2_linear_41_1221" x1="10.0031" y1="8.48602" x2="10.0031" y2="13.214" gradientUnits="userSpaceOnUse">
<stop stop-color="#4CAF4F"/>
<stop offset="1" stop-color="#10DC17"/>
</linearGradient>
<linearGradient id="paint3_linear_41_1221" x1="15.1247" y1="0.512756" x2="15.1247" y2="6.80612" gradientUnits="userSpaceOnUse">
<stop stop-color="#4CAF4F"/>
<stop offset="1" stop-color="#10DC17"/>
</linearGradient>
<linearGradient id="paint4_linear_41_1221" x1="10" y1="14.3912" x2="10" y2="20.2709" gradientUnits="userSpaceOnUse">
<stop stop-color="#4CAF4F"/>
<stop offset="1" stop-color="#10DC17"/>
</linearGradient>
<linearGradient id="paint5_linear_41_1221" x1="5.06583" y1="14.9257" x2="5.06583" y2="20.5" gradientUnits="userSpaceOnUse">
<stop stop-color="#4CAF4F"/>
<stop offset="1" stop-color="#10DC17"/>
</linearGradient>
<linearGradient id="paint6_linear_41_1221" x1="14.9372" y1="14.8684" x2="14.9372" y2="20.4682" gradientUnits="userSpaceOnUse">
<stop stop-color="#4CAF4F"/>
<stop offset="1" stop-color="#10DC17"/>
</linearGradient>
<linearGradient id="paint7_linear_41_1221" x1="3.01257" y1="6.00433" x2="3.01257" y2="15.5175" gradientUnits="userSpaceOnUse">
<stop stop-color="#4CAF4F"/>
<stop offset="1" stop-color="#10DC17"/>
</linearGradient>
<linearGradient id="paint8_linear_41_1221" x1="4.88154" y1="0.5" x2="4.88154" y2="6.81245" gradientUnits="userSpaceOnUse">
<stop stop-color="#4CAF4F"/>
<stop offset="1" stop-color="#10DC17"/>
</linearGradient>
</defs>
</svg>

                  </span> 
                <a href={project.contact.website}>{project.contact.website}</a></p>
                {project.contact.phones.map((phone, index) => (
                  <p key={index}>
                    <span className='pe-2'>

                    <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16.5317 13.1353C16.3889 12.9701 16.2122 12.8375 16.0136 12.7467C15.815 12.6558 15.5992 12.6088 15.3808 12.6088C15.1625 12.6088 14.9467 12.6558 14.7481 12.7467C14.5495 12.8375 14.3728 12.9701 14.23 13.1353C13.6923 13.6666 13.1546 14.2044 12.6234 14.7489C12.5735 14.8168 12.4993 14.8629 12.4162 14.8776C12.3332 14.8923 12.2477 14.8744 12.1775 14.8276C11.83 14.6374 11.4562 14.4865 11.1217 14.2766C9.58706 13.2817 8.22674 12.0407 7.09542 10.6034C6.50475 9.90684 6.01672 9.12932 5.64619 8.29451C5.6059 8.22529 5.59233 8.14371 5.60803 8.06517C5.62374 7.98662 5.66764 7.91655 5.73145 7.86816C6.26916 7.34341 6.79376 6.81211 7.32492 6.27425C7.49827 6.13021 7.63778 5.94975 7.73353 5.74569C7.82927 5.54163 7.87891 5.31899 7.87891 5.09358C7.87891 4.86816 7.82927 4.64551 7.73353 4.44145C7.63778 4.23739 7.49827 4.05692 7.32492 3.91289L6.05932 2.64695C5.62653 2.21403 5.19373 1.77456 4.74782 1.33508C4.60382 1.17176 4.42673 1.04096 4.22831 0.951368C4.02988 0.861773 3.81467 0.81543 3.59697 0.81543C3.37927 0.81543 3.16405 0.861773 2.96563 0.951368C2.76721 1.04096 2.59012 1.17176 2.44612 1.33508C1.90184 1.86639 1.3838 2.41736 0.826408 2.9421C0.335681 3.40505 0.0421322 4.03932 0.00672718 4.71313C-0.0399863 5.81818 0.157032 6.91998 0.583793 7.94032C1.4017 10.0614 2.57968 12.0253 4.06583 13.7453C6.02189 16.0948 8.45644 18.0001 11.207 19.3338C12.4293 19.9741 13.7668 20.3643 15.1415 20.4817C15.602 20.5335 16.0682 20.4748 16.5015 20.3106C16.9348 20.1463 17.3228 19.8812 17.6334 19.5372C18.0924 19.019 18.6104 18.5467 19.1023 18.0548C19.2723 17.9101 19.4089 17.7301 19.5026 17.5274C19.5963 17.3247 19.6448 17.104 19.6448 16.8806C19.6448 16.6573 19.5963 16.4367 19.5026 16.2339C19.4089 16.0312 19.2723 15.8513 19.1023 15.7065C18.2541 14.8495 17.3973 13.9924 16.5317 13.1353Z" fill="url(#paint0_linear_41_1217)"/>
<path d="M19.935 9.38994C18.2275 5.40046 15.0401 2.22864 11.0429 0.541426C10.882 0.481316 10.7038 0.486799 10.5469 0.556719C10.3899 0.62664 10.2666 0.755396 10.2036 0.915292C10.1692 0.995304 10.1512 1.08136 10.1504 1.16843C10.1497 1.25551 10.1662 1.34186 10.1992 1.42245C10.2322 1.50305 10.2808 1.57626 10.3424 1.63784C10.4039 1.69942 10.4771 1.74814 10.5577 1.78113C14.2423 3.3382 17.1803 6.26289 18.7546 9.94092C18.825 10.0969 18.9535 10.2192 19.1128 10.2817C19.2721 10.3442 19.4494 10.3419 19.6071 10.2754C19.6878 10.2401 19.7606 10.1889 19.821 10.1248C19.8815 10.0607 19.9285 9.98502 19.9591 9.90236C19.9897 9.81971 20.0033 9.73174 19.9992 9.6437C19.995 9.55566 19.9732 9.46935 19.935 9.38994Z" fill="url(#paint1_linear_41_1217)"/>
<path d="M10.2168 5.34284C12.4502 6.28383 14.2319 8.05427 15.1874 10.282C15.2381 10.3919 15.3183 10.4856 15.419 10.5528C15.5197 10.6199 15.637 10.6579 15.7579 10.6625C15.8464 10.6618 15.9337 10.6416 16.0136 10.6034C16.1644 10.5295 16.2811 10.4006 16.3397 10.2431C16.3983 10.0857 16.3942 9.9118 16.3284 9.75727C15.2454 7.22803 13.2237 5.21763 10.6889 4.14906C10.5328 4.09363 10.3615 4.09935 10.2095 4.16505C10.0574 4.23076 9.93587 4.35157 9.86922 4.50325C9.80757 4.661 9.80932 4.8365 9.87411 4.99299C9.93889 5.14949 10.0617 5.27485 10.2168 5.34284Z" fill="url(#paint2_linear_41_1217)"/>
<defs>
<linearGradient id="paint0_linear_41_1217" x1="9.8224" y1="0.81543" x2="9.8224" y2="20.5" gradientUnits="userSpaceOnUse">
<stop stop-color="#4CAF4F"/>
<stop offset="1" stop-color="#10DC17"/>
</linearGradient>
<linearGradient id="paint1_linear_41_1217" x1="15.0751" y1="0.5" x2="15.0751" y2="10.327" gradientUnits="userSpaceOnUse">
<stop stop-color="#4CAF4F"/>
<stop offset="1" stop-color="#10DC17"/>
</linearGradient>
<linearGradient id="paint2_linear_41_1217" x1="13.1025" y1="4.11127" x2="13.1025" y2="10.6625" gradientUnits="userSpaceOnUse">
<stop stop-color="#4CAF4F"/>
<stop offset="1" stop-color="#10DC17"/>
</linearGradient>
</defs>
</svg>

                    </span>
                    <a href={`tel:${phone}`}>{phone}</a>
                    </p>
                ))}
                <div className="socil-media">
                <a href={`https://wa.me/${project.contact.whatsapp}`}>WhatsApp</a>

                  {project.contact.pages.map((page, index) => (
                      <a key={index} href={page.pageUrl}>{page.pageType}</a>
                    
                  ))}
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
