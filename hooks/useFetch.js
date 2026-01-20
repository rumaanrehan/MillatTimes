import { useEffect, useState } from "react";
import { getJson } from "../services/http";

export default function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(url));
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    if (!url) return;

    (async () => {
      try {
        setLoading(true);
        const json = await getJson(url);
        if (alive) setData(json);
      } catch (e) {
        if (alive) setError(e);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [url]);

  return { data, loading, error };
}
