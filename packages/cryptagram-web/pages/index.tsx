import type { NextPage } from "next";
// import styles from "../styles/Home.module.css";
import { Spinner } from "../components";
// import Lottie from "react-lottie";
import Particles from "react-tsparticles";
import { useEffect, useMemo } from "react";

const particles = require("../particles.json");

const Home: NextPage = ({ nightmode }: any) => {
  // const opts = useMemo(() => {
  //   let particlesOpt = { ...particles };
  //   if (nightmode) {
  //     console.log("changed");

  //     particlesOpt.particles.color.value = "#FFFFFF";
  //     particlesOpt.particles.links.color = "#FFFFFF";
  //   } else {
  //     console.log("changed");

  //     particlesOpt.particles.color.value = "#000000";
  //     particlesOpt.particles.links.color = "#000000";
  //   }
  //   console.log(particlesOpt.particles.color.value);

  //   return particlesOpt;
  // }, [nightmode]);
  return (
    <div className="page flex-center-h">
      <Particles id="tsparticles" options={particles} />
    </div>
  );
};

export default Home;
