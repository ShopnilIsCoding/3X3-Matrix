import  { useEffect, useMemo, useRef, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim"; 
import 'animate.css';
import "./App.css";
import ShuffleArray from "./hooks/ShuffleArray";
import { toast } from "react-toastify";
import { GiLevelEndFlag } from "react-icons/gi";
import { BiSolidCoinStack } from "react-icons/bi";
import { FaMedal, FaRankingStar } from "react-icons/fa6";
import { ImCross } from "react-icons/im";
import { FaCircleInfo } from "react-icons/fa6";
import axios from "axios";
import BackgroundMusic from "./components/BackgroundMusic";

const App = () => {
  const [init, setInit] = useState(false);
  const [sequence, setSequence] = useState([]);
  const [data,setData]=useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [started, setStarted] = useState(false);
  const [isMatch, setIsMatch] = useState(true);
  const [showing,setShowing]=useState(true);
  const [level,setLevel]=useState(1);
  const [score, setScore]=useState(0);
  const [shuffleArray, setShuffleArray] = useState([]);
  const boxesRef = useRef([]);
  const btnRef = useRef();
  const clickRef = useRef(null);
  const brokeRef = useRef(null);
  const uiRef = useRef(null);
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  //data get post

  useEffect(()=>{
    axios.get('https://conversely-matrix-server.vercel.app/api/leaderboard')
    .then((res)=>
    {
      setData(res.data);
      console.log(res.data);
    })
  },[])

  const saveData=(e)=>
  {
    const name=e.target.name.value;
    const data={name,score}
    axios.post('https://conversely-matrix-server.vercel.app/api/leaderboard',data)
    .then((res)=>
    {
      if(res.data.insertedId)
        {
          toast.success('Score saved successfully!',{
            autoClose:1000,
            theme:"dark"
          });
          setTimeout(()=>{
            window.location.reload();
          })
        }
    },1500)
    .then((err)=>
    {
      toast.error(err.message,{
        autoClose:1000,
        theme:'dark'
      });
      setTimeout(()=>
      {
        window.location.reload();
      },1500)
    })


    

  }
  const filteredData = data.filter(player =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onUiClicked=()=>
  {
    if (uiRef.current) {
      uiRef.current.play();
    }
  }





  useEffect(()=>
  {
    const shuffledArray = ShuffleArray(numbers);
    setShuffleArray(shuffledArray);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const nextLevel=()=>
    {
      setSequence([]);
      setStarted(false);
      setShowing(true);
      const shuffledArray = ShuffleArray(numbers);
      setShuffleArray(shuffledArray);
      shuffleArray.forEach((box) => {
         
          boxesRef.current[box].style.backgroundColor = "transparent";
          boxesRef.current[box].classList.remove("animate__rubberBand","animate__animated")
          setShowing(false);
        
      });
    }
  useEffect(() => {
    const match = checkMatch(shuffleArray, sequence);
    setIsMatch(match);
    if(match && started)
    {
      setScore(prevScore => (prevScore + 1*level));
    }
    if(sequence.length===9)
    {
      setLevel(prevLevel => prevLevel + 1);
      toast.success(`Level ${level} completed!`,{
        autoClose:3000,
        theme:"dark"
      });
      nextLevel();
    }

    
    if (!match) {
      if (brokeRef.current) {
        brokeRef.current.play();
      }
      const lastNum = sequence[sequence.length - 1];
      boxesRef.current[lastNum].style.backgroundColor = "red";
      boxesRef.current[lastNum].classList.add("animate__hinge","animate__animated")
      setTimeout(() => {
        document.getElementById('my_modal_5').showModal();
      }, 1000);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sequence]);

  // Start a new game
  const newGame = () => {
    onUiClicked()
    setStarted(true);
    toast.warn('Game has been started.Keep memorizing the sequences!',{
      autoClose:5000,
      theme:"dark"
    });


    shuffleArray.forEach((box, index) => {
      setTimeout(() => {
        boxesRef.current[box].style.backgroundColor = "green";
        boxesRef.current[box].classList.add("animate__fadeIn","animate__animated")
      }, 2000 * (index + 1)/(0.1*(level+19)));
      
    });

    shuffleArray.forEach((box) => {
      setTimeout(() => {
        boxesRef.current[box].style.backgroundColor = "transparent";
        boxesRef.current[box].classList.remove("animate__fadeIn","animate__animated")
        setShowing(false);
      }, 20000/(0.1*(level+19)));
    });
    setTimeout(()=>
    {
      toast("☐ Now select each box sequentially",{
        theme:"dark"
      })
    },20000/(0.1*(level+19)))
  };

  //check matched or not matched

  const checkMatch = (fixed, dynamic) => {
    for (let i = 0; i < dynamic.length; i++) {
      if (dynamic[i] !== fixed[i]) {
        return false;
      }
    }
    return true;
  };

  // Handle sequence
  const handleSequence = (num) => {
    console.log("clicked")
    if (sequence.includes(num) || !started || !isMatch || showing) return;
    
    setSequence((prevSequence) => [...prevSequence, num]);
    console.log(shuffleArray,sequence);
    boxesRef.current[num].style.backgroundColor = "green";
    if (clickRef.current) {
      clickRef.current.play();
    }
    boxesRef.current[num].classList.add("animate__rubberBand","animate__animated")
  };

  // Initialize particles
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = () => {
    //console.log(container);
  };

  const options = useMemo(
    () => ({
      background: {
        color: {
          value: "",
        },
      },
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: {
            enable: false,
            mode: "push",
          },
          onHover: {
            enable: true,
            mode: "repulse",
          },
        },
        modes: {
          push: {
            quantity: 4,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
          },
        },
      },
      particles: {
        color: {
          value: "#16a34a",
        },
        links: {
          color: "#fb923c",
          distance: 200,
          enable: true,
          opacity: 0.5,
          width: 1,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "bounce",
          },
          random: false,
          speed: 6,
          straight: false,
        },
        number: {
          density: {
            enable: true,
          },
          value: 100,
        },
        opacity: {
          value: 0.5,
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 5 },
        },
      },
      detectRetina: true,
    }),
    []
  );

  return (
    <div className="flex flex-col min-h-screen justify-between">
      <div className=" bg-base-200 min-h-[20px] w-full text-center lg:text-2xl py-2 flex flex-col items-center justify-center gap-4 animate__fadeInDown animate__animated">
          <div className="flex flex-wrap justify-center gap-20">
          <p className="flex items-center text-info">level: <GiLevelEndFlag className="ml-5 mr-2 text-red-600"/>{level}</p>
          <p className="flex items-center text-info">Score: <BiSolidCoinStack className="ml-5 mr-2 text-green-600"/>{score}</p>
          <BackgroundMusic></BackgroundMusic>
          </div>

          {/* Leaderboard and how to play */}

         <div className="flex gap-4">
         <div className="drawer ">
  <input id="my-drawer" type="checkbox" className="drawer-toggle" />
  <div className="drawer-content" onClick={onUiClicked}>
    {/* Page content here */}
    <label htmlFor="my-drawer" className="btn btn-primary btn-outline drawer-button">
      <FaRankingStar className="text-xl" /> Leaderboard
    </label>
  </div>
  <div className="drawer-side z-50 ">
    <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay "></label>
    <div className="menu bg-base-200    text-warning min-h-full w-80 p-4">
      <p className=" bg-base-300 py-3 text-xl font-black">Leaderboard</p>
      {/* Search field */}
      <input
        type="text"
        placeholder="Search by name"
        className="input input-bordered input-warning w-full mb-4 mt-5"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {/* Leaderboard content */}
      <div className="overflow-auto">
        <table className="table table-zebra text-warning bg-black">
        <thead>
      <tr>
        <th className="text-warning">Rank</th>
        <th className="text-warning">Name</th>
        <th className="text-warning">Score</th>
      </tr>
    </thead>
    <tbody>
    {filteredData.map((player, index) => (
      <tr key={index}>
      <th className="text-warning">{player.rank ==1 && <FaMedal className="text-yellow-500" /> ||player.rank==2 && <FaMedal className="text-gray-500" /> || player.rank==3 && <FaMedal className="text-orange-500" /> || `#${player.rank}`}</th>
      <td className="text-warning">{player.name}</td>
      <td className="text-warning">{player.score}</td>
    </tr>
          // <li key={player._id} className="mb-2 flex items-center gap-2">
          //   {index === 0 && <FaMedal className="text-yellow-500" />}
          //   {index === 1 && <FaMedal className="text-gray-500" />}
          //   {index === 2 && <FaMedal className="text-orange-500" />}
          //   {index > 2 && <span className="text-lg font-bold">#{index + 1}</span>}
          //   <span className="flex-1">{player.name}</span>
          //   <span className="text-info">{player.score}</span>
          // </li>
        ))}
    </tbody>

        </table>
      </div>
    </div>
  </div>
</div>

<button className="btn btn-primary btn-outline" onClick={()=>{document.getElementById('my_modal_6').showModal()
  onUiClicked();
}}><FaCircleInfo /> How To Play</button>
         </div>
          

        </div>
        
      {init && (
        <Particles id="tsparticles" particlesLoaded={particlesLoaded} options={options} />
      )}
      <div className="container flex-1 flex flex-col justify-center items-center mx-auto my-6 ">
      
       
        
        <h1 className="text-3xl text-orange-400 font-black mb-2 animate__animated animate__zoomInDown -z-50">3X3 MATRIX</h1>
        <div className="grid grid-cols-3 grid-rows-3 ">
          {[1,2,3,4,5,6,7,8,9].map((num) => (
            <div
              key={num}
              className="border border-gray-300 p-6 text-3xl font-bold cursor-pointer hover:shadow-2xl hover:shadow-primary"
              onClick={() => handleSequence(num)}
              ref={(bx) => (boxesRef.current[num] = bx)}
            >
              {num}
            </div>
          ))}
        </div>
        <button className={`btn mt-6 btn-primary   ${started && "hidden"}`} ref={btnRef} onClick={newGame}>Start Level-{level}</button>
      </div>
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
  <div className="modal-box">
    
    <div className="">
      <form method="dialog" onSubmit={saveData}>
      <h3 className="font-bold text-2xl w-fit mx-auto flex items-center gap-2 ">Your Score :<BiSolidCoinStack className="inline-block text-green-600"/> {score}</h3>
    <input
  type="text"
  placeholder="Your Name" required name="name"
  className="input input-bordered input-primary w-full mt-2" />
    <p className="py-4">Nice Try! Save & Try Again?</p>
        
        <button className="btn btn-primary animate-pulse flex w-fit mx-auto" type="submit">Save & Try Again</button>
      </form>
    </div>
  </div>
</dialog>
<dialog id="my_modal_6" className="modal modal-bottom sm:modal-middle">
  <div className="modal-box">
    <h3 className="font-bold text-lg">How to Play</h3>
    <p className="py-4">
      1. Click "Start Level-{level}" to begin.<br />
      2. Memorize the sequence of highlighted boxes.<br />
      3. Click the boxes in the same order.<br />
      4. Advance levels by correctly replicating sequences.<br />
      5. Each Level will increase the highlighting speed.<br />
      6. Score increases with each correct sequence.<br />
      7. Game over if you click out of order.
    </p>
    <div className="modal-action">
      <form method="dialog">
        <button onClick={onUiClicked} className="btn btn-warning animate-pulse"><ImCross /> Close</button>
      </form>
    </div>
  </div>
</dialog>
<div className="bg-base-200 min-h-[20px] w-full text-center text-xl lg:text-2xl py-2 animate__animated animate__fadeInUp">
          Developed By <a href="https://facebook.com/shopnil.ccj" className="text-info link font-bold animate-pulse">Rahomotul Islam Shopnil</a>

        </div>

        {/* audios */}
        <audio ref={clickRef} preload="auto">
  <source src="/click.mp3" type="audio/mp3" />
  Your browser does not support the audio element.
</audio>
        <audio ref={brokeRef} preload="auto">
  <source src="/broke.mp3" type="audio/mp3" />
  Your browser does not support the audio element.
</audio>
        <audio ref={uiRef} preload="auto">
  <source src="/uiclick.mp3" type="audio/mp3" />
  Your browser does not support the audio element.
</audio>


    </div>
  );
};

export default App;
