import { useState, useEffect, useMemo } from 'react';

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const match = window.matchMedia(query);

    const handleChange = () => setMatches(match.matches);

    // Add event listener on component mount
    match.addEventListener('change', handleChange);

    // Cleanup function to remove event listener on component unmount
    return () => match.removeEventListener('change', handleChange);
  }, [query]); // Dependency array includes the query

  return matches;
}

export default useMediaQuery;