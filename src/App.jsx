import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [sequence, setSequence] = useState([]);
  const boxesRef = useRef([]);

  //change color to orange in sequence

  useEffect(() => {
    if (sequence.length === 9 && boxesRef.current!=null) {
      sequence.forEach((box, index) => {
        setTimeout(() => {
          boxesRef.current[box].style.backgroundColor = "orange";
        }, 1000 * (index + 1));
      });
    }
  }, [sequence]);

  //handle sequence
  const handleSequence = (num) => {
    if (sequence.includes(num)) return;
    setSequence([...sequence, num]);
    boxesRef.current[num].style.backgroundColor = "green";
  };

  return (
    <>
      <div className="container min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-3xl text-orange-400 font-black mb-2">3X3 MATRIX</h1>
        <div className="grid grid-cols-3 grid-rows-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
            return (
              <div
                key={num}
                className="border border-gray-300 p-6 text-3xl font-bold cursor-pointer hover:shadow-2xl hover:shadow-orange-400"
                onClick={() => handleSequence(num)}
                ref={(bx) => (boxesRef.current[num] = bx)}
              >
                {num}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default App;
