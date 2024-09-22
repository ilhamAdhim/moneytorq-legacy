import Lottie from "lottie-react";
import LoaderAnimation from "@root/public/animation/moneytorq-search-loader.json";

function LoaderSearch() {
  return <Lottie className="m-auto w-full h-full" animationData={LoaderAnimation} />;
}

export default LoaderSearch;
