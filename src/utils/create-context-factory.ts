import { createContext, useContext as useContextReact } from "react";

export const createContextFactory = <T>() => {
  const context = createContext<T | null>(null);

  const useContext = () => {
    const ctx = useContextReact(context);

    if (!ctx) {
      throw new Error("ERROR CONTEXT");
    }

    return ctx;
  };

  return {
    provider: context.Provider,
    useContext,
  };
};
