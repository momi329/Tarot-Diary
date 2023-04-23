import "./index.css";
import { Outlet } from "react-router-dom";
import { AuthContextProvider } from "./context/authContext";
import Header from "./components/Header";
import Background from "./components/Background";
const globalStyle =
  "bg-black m-0 z-0 relative text-white font-notoSansJP h-[100%] w-[100vw] ";
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
