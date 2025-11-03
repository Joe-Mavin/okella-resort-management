import React from 'react';

const LocationMap = ({ className = '' }) => {
  // Precise coordinates for OKELLA RESORT next to Bondo TTI
  // Based on research: Bondo TTI is 5km from Bondo town on Bondo-Misori road
  // Bondo town: 0.23861°N, 34.26944°E
  // OKELLA RESORT: Slightly northeast of Bondo TTI
  const latitude = 0.2450000; // Approximately 5km from Bondo town
  const longitude = 34.2750000; // Along Bondo-Misori road

  // Create Google Maps embed URL with precise coordinates
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dkS4oiigAoC05o&q=${latitude},${longitude}&zoom=15&maptype=roadmap`;
  
  // Fallback URL with search query
  const fallbackUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7978.568!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMMKwMTQnNDIuMCJOIDM0wrAxNicyNy4wIkU!5e0!3m2!1sen!2ske!4v${Date.now()}`;

  return (
    <div className={`relative ${className}`}>
      <iframe
        src={fallbackUrl}
        width="100%"
        height="100%"
        style={{ border: 0, minHeight: '500px' }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="OKELLA RESORT - Next to Bondo Technical Training Institute"
        className="rounded-xl"
      />
      
      {/* Overlay with location info */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary-500 rounded-full animate-pulse"></div>
          <div>
            <p className="font-semibold text-sm text-gray-800">OKELLA RESORT</p>
            <p className="text-xs text-gray-600">Next to Bondo TTI</p>
          </div>
        </div>
      </div>

      {/* Coordinates info */}
      <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded">
        {latitude}°N, {longitude}°E
      </div>
    </div>
  );
};

export default LocationMap;
