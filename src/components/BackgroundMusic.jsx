import  { useRef, useState } from 'react';
import { MdMusicOff,MdMusicNote } from "react-icons/md";

const BackgroundMusic = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div>
      <audio ref={audioRef} loop>
        <source src="/music.mp3" type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
     <div className='flex gap-3 justify-center items-center'>
     <span>BGM</span>
      <button
        onClick={togglePlayPause}
        className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
      >
        {isPlaying ? <MdMusicNote className='text-green-600' size={24} /> : <MdMusicOff  className='text-red-600' size={24} />}
      </button>
     </div>
    </div>
  );
};

export default BackgroundMusic;
