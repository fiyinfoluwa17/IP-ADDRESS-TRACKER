import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import img1 from "../assets/images/pattern-bg-desktop.png";
import img2 from "../assets/images/icon-arrow.svg";
import customMarkerIcon from "../assets/images/icon-location.svg";
import "./Home.css";

const Home = () => {
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]); // Default center
  const [searchInput, setSearchInput] = useState('');
  const [locationInfo, setLocationInfo] = useState({
    ipAddress: '192.212.174.101',
    location: 'Brooklyn, NY 10001',
    timezone: 'UTC -05:00',
    isp: 'SpaceX Starlink',
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setMapCenter([latitude, longitude]);
      },
      (error) => {
        console.error('Error getting user location:', error);
      }
    );
  }, []);

  const handleSearch = async () => {
    try {
      const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${searchInput}&key=YOUR_OPENCAGE_API_KEY`);
      const data = await response.json();
  
      if (data.results.length > 0) {
        const result = data.results[0];
        const { lat, lng } = result.geometry;
        setMapCenter([lat, lng]);
  
        setLocationInfo({
          ipAddress: 'YOUR_IP_ADDRESS',
          location: result.formatted,
          timezone: result.annotations.timezone.name,
          isp: 'YOUR_ISP',
        });
      } else {
        console.error('Location not found');
        // Clear locationInfo when the location is not found
        setLocationInfo({
          ipAddress: '',
          location: '',
          timezone: '',
          isp: '',
        });
      }
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  };
  
  return (
    <>
      <div className='all'>
        <div className="backimage"><img src={img1} alt="" /></div>
        <p className='ip'>IP Address Tracker</p>
        <input
          type="search"
          placeholder='Search for any IP address or domain'
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button onClick={handleSearch}><img src={img2} alt="" /></button>

        <div id='map'>
          <MapContainer
            center={mapCenter}
            zoom={13}
            style={{ height: '485px', width: '100%', position: 'relative' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* Custom Marker */}
            <Marker position={mapCenter} icon={L.icon({ iconUrl: customMarkerIcon, iconSize: [32, 32] })}>
              <Popup>
                Your current location.
              </Popup>
            </Marker>
          </MapContainer>

          <div className="section-overlay">
            <section>
              <div className='lastcard'>
                <h4>IP ADDRESS</h4>
                <p>{locationInfo.ipAddress}</p>
              </div>
              <div className='lastcard'>
                <h4>LOCATION</h4>
                <p>{locationInfo.location}</p>
              </div>
              <div className='lastcard'>
                <h4>TIMEZONE</h4>
                <p>{locationInfo.timezone}</p>
              </div>
              <div className='lastcard1'>
                <h4>ISP</h4>
                <p>{locationInfo.isp}</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
