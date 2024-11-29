import { BrowserRouter, Route, Routes } from "react-router";
import LandingPage from "./pages/LandingPage";
import GamePage from "./pages/Game";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <div className="h-screen bg-stone-800 text-white">
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/game" element={<GamePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
