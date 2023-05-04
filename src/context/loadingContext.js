import { createContext, useState } from "react";

export const LoadingContext = createContext({
  isLoading: true,
  setIsLoading: () => {},
});

export const LoadingContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};
