import React, { useEffect, useRef, useState } from "react";
import "./AudioPlayer.css";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";

const AudioPlayer = ({ audioSrc, image, setPlayingFile }) => {
  const audioRef = useRef();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMute, setIsMute] = useState(false);
  const [duration, setDuration] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState("");

  const handleDuration = (e) => {
    setCurrentTime(e.target.value);
    audioRef.current.currentTime = e.target.value;
  };

  function togglePlay() {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  }

  function toggleMute() {
    setIsMute(isMute ? false : true);
  }

  function handleVolume(e) {
    setVolume(e.target.volume);
    audioRef.current.volume = e.target.value;
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    const audio = audioRef.current;
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetdata", handleLoadedMetaData);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetdata", handleLoadedMetaData);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  function handleTimeUpdate() {
    setCurrentTime(audioRef.current.currentTime);
  }

  function handleLoadedMetaData() {
    setDuration(audioRef.current.duration);
  }

  function handleEnded() {
    setCurrentTime(0);
    setIsPlaying(false);
  }

  // Handle Cancel
  function handleCancel() {
    setIsPlaying(false);
  }

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!isMute) {
      setVolume(1);
      audioRef.current.volume = 1;
    } else {
      setVolume(0);
      audioRef.current.volume = 0;
    }
  }, [isMute]);

  return (
    <div className="custom-audio-player" style={{marginTop:"20px"}}>
      <img src={image} className="display-image-player" />
      <audio ref={audioRef} src={audioSrc} />
      <p className="audio-btn" onClick={togglePlay}>
        {isPlaying ? <FaPause /> : <FaPlay />}
      </p>
      <div className="duration-flex">
        <p>{formatTime(currentTime)}</p>
        <input
          className="duration-range"
          type="range"
          max={duration}
          value={currentTime}
          onChange={handleDuration}
          step={0.01}
        />
        {/* <p>-{formatTime(duration - currentTime)}</p> */}
        <p className="audio-btn" onClick={toggleMute}>
          {!isMute ? <FaVolumeUp /> : <FaVolumeMute />}
        </p>
        <input
          className="volume-range"
          type="range"
          onChange={handleVolume}
          value={volume}
          max={1}
          min={0}
          step={0.01}
        />

        <FaCircleXmark className="cancel-btn" onClick={()=>setPlayingFile("")}/>
      </div>
    </div>
  );
};

export default AudioPlayer;
