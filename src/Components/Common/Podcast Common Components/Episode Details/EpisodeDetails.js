import React from "react";
import Button from "../../Button/Button";

const EpisodeDetail = ({ title, description, audioFile, onClick, index }) => {
  return (
    <div style={{ width: "100%" }}>
      <h1 style={{ textAlign: "left", marginBottom: 0 }}>
        {index}. {title}
      </h1>
      <p style={{ marginLeft: "1.5rem" }} className="podcast-description">
        {description}
      </p>
      <Button
        text="Play"
        onClick={() => onClick(audioFile)}
        style={{ width: "150px", margin: "1rem 1.4rem" }}
      />
    </div>
  );
};

export default EpisodeDetail;
