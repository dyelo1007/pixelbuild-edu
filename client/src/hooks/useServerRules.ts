// src/hooks/useServerRules.ts
import { useEffect, useRef, useState } from "react";
import { Engine } from "json-rules-engine";

export function useServerRules() {
  const engineRef = useRef<Engine | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:5000/api/compatibility/rules");
        const { rules } = await res.json();
        engineRef.current = new Engine(rules);
      } catch (e) {
        console.error("Failed to fetch rules", e);
        engineRef.current = new Engine([]); // fallback (still allows app to run)
      } finally {
        setReady(true);
      }
    })();
  }, []);

  return { engineRef, ready };
}
