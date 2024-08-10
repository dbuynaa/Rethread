// hooks/useSearch.ts
import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function useSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null || value === '') {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      return params.toString();
    },
    [searchParams],
  );

  const setParam = useCallback(
    (name: string, value: string | null) => {
      const queryString = createQueryString(name, value);
      router.push(queryString ? `?${queryString}` : window.location.pathname);
    },
    [router, createQueryString],
  );

  const getParam = useCallback(
    (name: string) => {
      return searchParams.get(name);
    },
    [searchParams],
  );

  const removeParam = useCallback(
    (name: string) => {
      setParam(name, null);
    },
    [setParam],
  );

  return {
    setParam,
    getParam,
    removeParam,
    createQueryString,
  };
}
