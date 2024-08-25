"use client"

import { useEffect, useState } from "react";
import useMediaQuery from "./useMediaQuery";

function useViewports() {
  // ? isSmallViewport = Tablet & Phone view 
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  // const isBigScreen = useMediaQuery("(min-width: 1024px)");
  
  const [isSmallViewport, setIsSmallViewport] = useState(false);
  // const [isBigViewport, setIsBigViewport] = useState(false);

  useEffect(() => {
    setIsSmallViewport(isSmallScreen);
  }, [isSmallScreen]);

  // useEffect(() => {
  //   setIsBigViewport(isBigScreen);
  // }, [ isBigScreen]);

  return { isSmallViewport };
}

export default useViewports;
