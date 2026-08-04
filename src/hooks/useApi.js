import { useState, useEffect, useCallback } from "react";

/**
 * Tiny data-fetching hook for the service layer.
 *   const { data, loading, error, reload } = useApi(getDashboard);
 * Pass a stable function (module-level import) as `fn`.
 */
export default function useApi(fn) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  const load = useCallback(() => {
    let active = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    fn()
      .then((data) => active && setState({ data, loading: false, error: null }))
      .catch((error) => active && setState({ data: null, loading: false, error }));
    return () => { active = false; };
  }, [fn]);

  useEffect(load, [load]);

  return { ...state, reload: load };
}
