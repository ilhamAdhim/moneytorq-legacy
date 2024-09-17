import Lottie from "lottie-react";
import LoaderAnimation from "@root/public/animation/moneytorq-loader.json";

function LoaderCustom() {
  return <Lottie className="m-auto w-full h-full" animationData={LoaderAnimation} />;
}

export default LoaderCustom;
