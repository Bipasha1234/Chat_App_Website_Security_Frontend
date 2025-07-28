import { useNavigate } from "react-router-dom";
import icon1 from "../assets/images/image1.png";
import icon10 from "../assets/images/image2.png";
import icon7 from "../assets/images/image7.png";
import icon8 from "../assets/images/image8.png";

function MainHome() {
  const navigate = useNavigate();

  return (
    <div className="font-open-sans bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen px-6 py-12">
      
      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:justify-between gap-12">
        <div className="md:w-1/2 space-y-8">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 leading-tight">
            Connect Seamlessly with Your Loved Ones
          </h1>
          <p className="text-lg text-black max-w-md">
            Private chats, group conversations, voice messages, stickers, and more all in one secure platform.
          </p>
          <div className="flex gap-6">
            <button
              onClick={() => navigate("/register")}
              className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded shadow-md transition"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate("/login")}
              className="border border-blue-700 text-blue-700 px-6 py-3 rounded hover:bg-blue-100 transition"
            >
              Login
            </button>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <img src={icon1} alt="Chat Illustration" className="w-full max-w-lg object-contain rounded-lg shadow-lg" />
        </div>
      </section>

      {/* FEATURES CARDS */}
      <section className="max-w-7xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Private Messaging Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center">
          <img src={icon7} alt="Private Messaging" className="w-20 h-20 mb-6" />
          <h3 className="text-xl font-semibold text-blue-800 mb-2">Private Messaging</h3>
          <p className="text-black">
            Stay connected with people who matter most through secure, real-time private messages.
          </p>
        </div>

        {/* Group Chat Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center">
          <img src={icon8} alt="Group Chat" className="w-20 h-20 mb-6" />
          <h3 className="text-xl font-semibold text-blue-800 mb-2">Group Chats</h3>
          <p className="text-black">
            Organize your friends and family effortlessly, with rich media and easy-to-use group conversations.
          </p>
        </div>

        {/* Share Feelings Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center">
          <img src={icon10} alt="Share Feelings" className="w-20 h-20 mb-6" />
          <h3 className="text-xl font-semibold text-blue-800 mb-2">Express Yourself</h3>
          <p className="text-black">
            Use voice messages,send files,photos to communicate your mood and stories vividly.
          </p>
        </div>

      </section>
    </div>
  );
}

export default MainHome;
