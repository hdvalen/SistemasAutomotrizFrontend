import React from "react";

export default function SketchfabEmbed() {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "360px",
        left: "950px",
        padding: "10px",
        marginBottom: "20px",
        zIndex: 10,
      }}
    >
      <div className="sketchfab-embed-wrapper">
        <iframe
          title="2020 Porsche 718 Spyder"
          src="https://sketchfab.com/models/1bb367ebaee14829a24e9b5444c15087/embed?autospin=1&autostart=1&preload=1&transparent=1"
          allow="autoplay; fullscreen; xr-spatial-tracking"
          allowFullScreen
          style={{ width: "500px", height: "250px" }}
        ></iframe>
       
          
          
      </div>
    </div>
  );
}
