import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import "./index.css";
import Member from "./pages/Member";
import Spread from "./pages/Spread/Spread";
import TarotCard from "./pages/TarotCard";
// import Divine from "./pages/Spread/Divine";
import AskGPT from "./components/AskAndNote";
import { LoadingContextProvider } from "./context/loadingContext";
import Design from "./pages/Design";
import Divination from "./pages/Divination";
import Home from "./pages/Home/Home";
import Meaning from "./pages/Meanings";
import Profile from "./pages/Profile/Profile";
const root = ReactDOM.createRoot(
  document.getElementById("root") as Element | DocumentFragment
);
root.render(
  <LoadingContextProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="/signin" element={<Member />} />
          <Route path="/profile/:uid" element={<Profile />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/design" element={<Design />} />
          <Route path="/spread/:id" element={<Spread />} />
          <Route path="/card/:id" element={<TarotCard />} />
          <Route path="/ask" element={<AskGPT />} />
          <Route path="/meanings" element={<Meaning />} />
          <Route path="/divination" element={<Divination />} />
          {/* <Route path='*' element={<Navigate to='/' replace />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  </LoadingContextProvider>
);
