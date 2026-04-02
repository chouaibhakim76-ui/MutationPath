import { useState, useCallback } from 'react';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhatIsMutationPath from './components/WhatIsMutationPath';
import TheScience from './components/TheScience';
import Simulator from './components/Simulator';
import VirusProfiles from './components/VirusProfiles';
import RealWorldImpact from './components/RealWorldImpact';
import About from './components/About';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';

export default function App() {
  const [loaded, setLoaded] = useState(false);

  const handleLoadingComplete = useCallback(() => {
    setLoaded(true);
  }, []);

  return (
    <>
      <CustomCursor />
      {!loaded && <LoadingScreen onComplete={handleLoadingComplete} />}
      <Navbar />
      <main>
        <Hero />
        <WhatIsMutationPath />
        <TheScience />
        <Simulator />
        <VirusProfiles />
        <RealWorldImpact />
        <About />
      </main>
      <Footer />
    </>
  );
}
