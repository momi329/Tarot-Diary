import { useContext } from "react";
import { Outlet } from "react-router-dom";
import Background from "./components/Background";
import Header from "./components/Header";
import { AuthContextProvider } from "./context/authContext";
import { LoadingContext } from "./context/loadingContext";
import "./index.css";
import LoadingPage from "./pages/LoadingPage";

function App() {
  const { isLoading } = useContext(LoadingContext);

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
