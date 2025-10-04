import { useEffect, useRef, useState } from "react";
import { Engine } from "json-rules-engine";
import API from "@/utils/api";

export function useServerRules() {
  const engineRef = useRef<Engine | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/compatibility/rules");

        const { rules } = res.data;

        engineRef.current = new Engine(rules);
      } catch (e) {
        console.error("Failed to fetch rules", e);
        engineRef.current = new Engine([]);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  return { engineRef, ready };
}
