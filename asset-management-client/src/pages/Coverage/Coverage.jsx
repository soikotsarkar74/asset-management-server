
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Coverage = () => {
  const position = [23.8103, 90.4125]; 

  return (
    <section className="py-16">
      <h3 className="text-center text-3xl font-bold mb-8">
        We are available in 64 districts
      </h3>

      <div className="max-w-5xl mx-auto">
        <MapContainer
          center={position}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: "400px", width: "100%" }}
          className="rounded-xl shadow-lg"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={position}>
            <Popup>
              AssetVerse HQ <br /> Dhaka, Bangladesh
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </section>
  );
};

export default Coverage;
