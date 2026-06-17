import { useState, useEffect } from "react";
import TickerBar   from "./components/TickerBar.jsx";
import Navbar      from "./components/Navbar.jsx";
import Footer      from "./components/Footer.jsx";
import HomePage        from "./pages/HomePage.jsx";
import LearnPage       from "./pages/LearnPage.jsx";
import FeaturesPage    from "./pages/FeaturesPage.jsx";
import CopyTradingPage from "./pages/CopyTradingPage.jsx";
import CRTPage         from "./pages/CRTPage.jsx";
import SMCPage         from "./pages/SMCPage.jsx";
import { G } from "./constants/index.js";

function PageRenderer({ page, setPage }) {
  switch (page) {
    case "home":     return <HomePage     setPage={setPage} />;
    case "learn":    return <LearnPage    />;
    case "features": return <FeaturesPage />;
    case "copy":     return <CopyTradingPage />;
    case "crt":      return <CRTPage      />;
    case "smc":      return <SMCPage      />;
    default:         return <HomePage     setPage={setPage} />;
  }
}

export default function App() {
  const [page, setPage] = useState("home");

  // Scroll to top on every page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  return (
    <div style={{ minHeight: "100vh", background: G.bg }}>
      <TickerBar />
      <Navbar page={page} setPage={setPage} />
      <main>
        <PageRenderer page={page} setPage={setPage} />
      </main>
      <Footer setPage={setPage} />
    </div>
  );
}
