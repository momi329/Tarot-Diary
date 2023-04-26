import "./index.css";
import { Outlet } from "react-router-dom";
import { AuthContextProvider } from "./context/authContext";
import Header from "./components/Header";
import Background from "./components/Background";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Background />
      <AuthContextProvider>
        <Header />
        <Outlet />
      </AuthContextProvider>
    </>
  );
}

export default App;
