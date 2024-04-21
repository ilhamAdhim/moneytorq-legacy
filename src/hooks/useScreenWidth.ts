"use client"

import { useEffect, useState } from "react";
import useMediaQuery from "./useMediaQuery";

function useSmallViewport() {
  // ? isSmallViewport = Tablet & Phone view 
  const [isSmallViewport, setIsSmallViewport] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    setIsSmallViewport(isSmallScreen);
  }, [isSmallScreen]);

  return { isSmallViewport };
}

export default useSmallViewport;
