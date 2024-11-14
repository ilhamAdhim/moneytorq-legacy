"use client";

import Lottie from "lottie-react";
import AuthAnimation from "@root/public/animation/auth-assets.json";

function AuthIllustration() {
  return <Lottie className="m-auto w-[500px] h-[500px]" animationData={AuthAnimation} />;
}

export default AuthIllustration;
