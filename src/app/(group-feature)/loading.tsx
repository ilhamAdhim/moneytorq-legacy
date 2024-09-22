"use client";

import LoaderSearch from "@/components/composites/Modals/Loaders/LoaderSearch";
import { Box, Text } from "@radix-ui/themes";

function LoadingState() {
  return (
    <Box className="h-[75vh] w-[80vw] m-auto">
      <LoaderSearch />
      <div className="w-full text-center font-semibold"> Loading Data... </div>
    </Box>
  );
}

export default LoadingState;
