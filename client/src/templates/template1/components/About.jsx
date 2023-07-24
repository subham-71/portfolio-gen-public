import React , { useEffect, useState } from "react";
import Tilt from "react-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { getAbout} from "../../../constants/index";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import LazyLoad from 'react-lazyload';


const ServiceCard = ({ index, name, icon }) => (
  <Tilt className='xs:w-[250px] w-full'>
    <motion.div
      variants={fadeIn("right", "spring", index * 0.5, 0.75)}
      className='w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card'
    >
      <div
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className='bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col'
      >
        <LazyLoad once>
          <img
            src={icon}
            alt='web-development'
            className='w-full h-full object-contain'
          />
        </LazyLoad>

        <h3 className='text-white text-[20px] font-bold text-center'>
          {name}
        </h3>
      </div>
    </motion.div>
  </Tilt>
);


const About = ({ clientId }) => {
  const [about, setAbout] = useState({ overview: '', services: [] });
  const [servicesX, setservicesX] = useState([]);

useEffect(() => {
  const fetchAbout = async () => {
    const aboutData = await getAbout(clientId);

    if (aboutData && aboutData.length > 0) {
      const aboutItem = aboutData[0];

      // Perform null checks and set default values
      const overview = aboutItem.overview || '';
      const services = aboutItem.services || [];

      setAbout({ ...about, overview });
      setservicesX(services);
    } else {
      // No data available, set default values
      setAbout({ overview: '', services: [] });
      setservicesX([]);
    }
  };

  fetchAbout();
}, [clientId]);


  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Introduction</p>
        <h2 className={styles.sectionHeadText}>Overview</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]"
      >
        {about.overview}
      </motion.p>

      <div className="mt-20 grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {servicesX.map((service, index) => (
          <ServiceCard key={service.name} index={index} {...service} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(About, "about");
