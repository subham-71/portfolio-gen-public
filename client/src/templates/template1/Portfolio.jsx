import { About, Contact, Experience, Hero, Navbar, Projects, StarsCanvas } from "./components";
import React from 'react';
import { useParams } from 'react-router-dom';


const Portfolio = () => {
  
  const {clientId}  = useParams();

  return (
    <>
      <div className='relative z-0 bg-primary'>
        <div className='bg-hero-pattern bg-cover bg-no-repeat bg-center'>
          <Navbar />
          <Hero  clientId={clientId} />
        </div>
        <About  clientId={clientId} />
        <Experience clientId={clientId} />
        <Projects   clientId={clientId} />
        <div className='relative z-0'>
          <Contact clientId={clientId}/>
          <StarsCanvas />
        </div>
      </div>
    </>
  );
}

export default Portfolio;
