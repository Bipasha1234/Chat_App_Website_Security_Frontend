import Footer from "../components/footer";
import Header from "../components/header";
import MainHome from "../components/home1";

function Home() {
  return (
    <div className="bg-white min-h-screen">
      <Header />
      <div className="container mx-auto p-4">
        <MainHome />
      </div>
      <Footer />
    </div>
  );
}

export default Home;
