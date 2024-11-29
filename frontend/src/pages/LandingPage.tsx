import { useNavigate } from "react-router";
import img from "../assets/chess-board.jpg";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="grid gird-cols-1 gap-4 w-full max-w-screen-md mx-auto py-8 px-6">
      <div>
        <img
          src={img}
          alt="chess board image"
          className="w-full h-auto rounded-lg mx-auto"
        />
      </div>
      <div className="space-y-6 md:flex md:flex-col md:align-center md:justify-center md:px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-center">
          Play Chess online on the #1 site! 🚀
        </h1>
        <button
          onClick={() => navigate("/game")}
          className="bg-[#81b64c] w-full mx-auto py-5 rounded-lg text-2xl font-bold"
        >
          Play Online ♟️
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
