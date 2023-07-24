import React , { useEffect, useState } from "react";
import Tilt from "react-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { github,eye } from "../assets";
import { SectionWrapper } from "../hoc";
import { getProjects } from "../../../constants/index";
import { fadeIn, textVariant } from "../utils/motion";
import LazyLoad from 'react-lazyload';


const Spinner = () => {
  return (
    <div className="spinner flex items-center justify-center">
      <div className="spinner-inner animate-spin rounded-full border-4 border-t-4 border-gray-200 h-12 w-12" />
    </div>
  );
};

const ProjectCard = ({
  index,
  name,
  description,
  techStacks,
  image,
  source_code_link,
  demo_link
}) => {

  const [imageLoaded, setImageLoaded] = useState(false);



  return (
    
    <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
      <Tilt
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className='bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full'
      >
        <div className='relative w-full h-full'>
          <LazyLoad once>
          
          <img
            src={image}
            alt='project_image'
            className={`w-full h-full object-cover rounded-2xl ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            />

          </LazyLoad>

          <div className='absolute inset-0 flex justify-end m-3 card-img_hover'>
            {source_code_link && <div
              onClick={() => window.open(source_code_link, "_blank")}
              className='black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer'
            >
              <img
                src={github}
                alt='source code'
                className='w-1/2 h-1/2 object-contain'
              />
            </div>}
           {demo_link && <div
              onClick={() => window.open(demo_link, "_blank")}
              className='ml-1 black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer'
            >
              <img
                src={eye}
                alt='source code'
                className='w-1/2 h-1/2 object-contain '
              />
            </div>}
          </div>
        </div>

          <h3 className='mt-5 text-white font-bold text-[24px]'>{name}</h3>
          <p className='mt-2 text-secondary text-[14px]'>{description}</p>

        <div className='mt-4 flex flex-wrap gap-2'>
          {techStacks.map((tag) => (
            <p
              key={`${name}-${tag.name}`}
              className={`text-[14px] ${tag.color}`}
            >
              #{tag.name}
            </p>
          ))}
        </div>
      </Tilt>
    </motion.div>
  );
};

const Projects = ({clientId}) => {
  const [projects, setProjects] = React.useState([]);
  
  useEffect(() => {
    const fetchProjects = async () => {
      const projectsData = await getProjects(clientId);
      setProjects(projectsData);
    };
    
    fetchProjects();
  }, [clientId]);
  return (
    <>
      <motion.div variants={textVariant()}>
        <h2 className={`${styles.sectionHeadText}`}>Projects</h2>
      </motion.div>

      

      <div className='mt-20 flex flex-wrap gap-7'>
        {projects.map((project, index) => (
          <ProjectCard key={`project-${index}`} index={index} {...project} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Projects, "projects");
