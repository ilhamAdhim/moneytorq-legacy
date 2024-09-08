"use client";

import { useEffect, useState } from "react";
import useMediaQuery from "./useMediaQuery";

function useViewports() {
  // ? isSmallViewport = Tablet & Phone view
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  const [isSmallViewport, setIsSmallViewport] = useState(false);

  useEffect(() => {
    setIsSmallViewport(isSmallScreen);
  }, [isSmallScreen]);

  return { isSmallViewport };
}

export default useViewports;
