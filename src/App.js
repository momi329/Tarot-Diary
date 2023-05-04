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
  const { isLoading } = useContext(LoadingContext);

  useEffect(() => {
    console.log("loading", isLoading);
  }, [isLoading]);
  return (
    <>
      <Background />
      <LoadingContextProvider>
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
      </LoadingContextProvider>
    </>
  );
}

export default App;
