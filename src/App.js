import "./index.css";
import { Outlet } from "react-router-dom";
import { AuthContext, AuthContextProvider } from "./context/authContext";
import { LoadingContextProvider } from "./context/loadingContext";
import { LoadingContext } from "./context/loadingContext";
import Header from "./components/Header";
import Background from "./components/Background";
import Footer from "./components/Footer";
import { useContext, useEffect } from "react";
import LoadingPage from "./pages/LoadingPage";

function App() {
  const { isLoading, setIsLoading } = useContext(LoadingContext);

  // useEffect(() => {
  //   console.log("loading", isLoading);
  //   setTimeout(() => {
  //     setIsLoading(false);
  //   }, 5000);
  // }, []);

  return (
    <>
      <Background />
      <AuthContextProvider>
        {isLoading ? (
          <LoadingPage />
        ) : (
          <>
            <Header />
            <Outlet />
          </>
        )}
      </AuthContextProvider>
    </>
  );
}

export default App;
