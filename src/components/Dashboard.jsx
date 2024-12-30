import { useEffect } from "react";
import { useState } from "react";
import MyVerySlowComponent from "./MyVerySlowComponent";

export function Dashboard() {
  console.log("rendering dashboard");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <h1>{currentTime.toTimeString()}</h1>
      <MyVerySlowComponent />
    </>
  );
}
