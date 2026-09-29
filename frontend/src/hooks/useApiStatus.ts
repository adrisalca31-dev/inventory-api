import { useEffect, useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

interface ApiStatus {
  isOnline: boolean;
  isChecking: boolean;
}

function useApiStatus(): ApiStatus {
  const [isOnline, setIsOnline] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function checkApiStatus() {
      setIsChecking(true);

      try {
        const response = await fetch(`${API_URL}/health`);

        if (isMounted) {
          setIsOnline(response.ok);
        }
      } catch {
        if (isMounted) {
          setIsOnline(false);
        }
      } finally {
        if (isMounted) {
          setIsChecking(false);
        }
      }
    }

    checkApiStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    isOnline,
    isChecking,
  };
}

export default useApiStatus;