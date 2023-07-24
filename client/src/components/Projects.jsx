import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from './Navbar';
import { storage } from '../config/firebaseConfig';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Projects = () => {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const base_url = "https://portfolio-gen-backend.onrender.com";


  // Fetch data from API and populate form fields
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${base_url}/projects/getProjects`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "clientId": currentUser.uid,
          }),
        });
        const data = await response.json();
        setProjects(data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [currentUser.uid]);

    const notifySuccess = (message) => {
      toast.success(message);
    };

    const notifyError = (message) => {
      toast.error(message);
    };

  const addProject = () => {
    setProjects([...projects, { id: uuidv4(), name: '',description: '', techStacks: [], image: '', source_code_link: '', demo_link: '' }]);
  };


  const addTechStack = (projectIndex) => {
    const updatedProjects = [...projects];
    if (updatedProjects[projectIndex].techStacks.length < 3) {
      updatedProjects[projectIndex].techStacks.push('');
      setProjects(updatedProjects);
    }
  };

  const removeTechStack = (projectIndex, stackIndex) => {
    const updatedProjects = [...projects];
    updatedProjects[projectIndex].techStacks.splice(stackIndex, 1);
    setProjects(updatedProjects);
  };

  const handleProjectChange = (index, field, value) => {
    const updatedProjects = [...projects];
    updatedProjects[index][field] = value;
    setProjects(updatedProjects);
  };

  const handleTechStackChange = (projectIndex, stackIndex, value) => {
  const updatedProjects = [...projects];
  updatedProjects[projectIndex].techStacks[stackIndex] = {
    name: value,
    color: ['blue-text-gradient', 'green-text-gradient', 'pink-text-gradient'][stackIndex],
  };
  setProjects(updatedProjects);
};

  const handleImageUpload = async (projectIndex, event) => {
    setIsLoading(true);
    const file = event.target.files[0];
    const storageRef = storage.ref();
    const id = uuidv4();
    const filename = id.concat(file.name);
    const fileRef = storageRef.child(`${currentUser.uid}/projects/${filename}`);

    try{

      await fileRef.put(file);
      const downloadURL = await fileRef.getDownloadURL();
      
      const updatedProjects = [...projects];
      updatedProjects[projectIndex].image = downloadURL;
      setProjects(updatedProjects);
      setIsLoading(false);
    }
     catch (error) {
      console.error('Error uploading image:', error);
      notifyError('An error occurred while uploading the image.');
      setIsLoading(false);
    }

  };
  
  const saveProject = async (index) => {
    setIsLoading(true);
    const project = projects[index];
    const data = {
      "name": project.id,
      "clientId": currentUser.uid,
      "project": project
    };


    try {
      const response = await fetch(`${base_url}/projects/addProject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      console.log(responseData)
      if (responseData._writeTime) {
        notifySuccess("Saved successfully");
      } else {
        notifyError('Failed to save project.');
      }
    } catch (error) {
       console.error('Error sending data:', error);
       notifyError('An error occurred while saving project.');
    }
    setIsLoading(false);
  };

  const removeProject = async (index) => {
    setIsLoading(true);
   
     const data = {
      "name": projects[index].id,
      "clientId": currentUser.uid,
    };

     try {
      const response = await fetch(`${base_url}/projects/removeProject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      try{
        
        const delIcon = storage.refFromURL(projects[index].image);
        await delIcon.delete();
      }
      catch (error) {
      }

      const responseData = await response.json();
     if (responseData._writeTime) {
        notifySuccess("Saved successfully");
      } else {
        notifyError('Failed to remove project.');
      }
    } catch (error) {
      console.error('Error sending data:', error);
      notifyError('An error occurred while removing project.');
    }
    
    const updatedProjects = [...projects];
    updatedProjects.splice(index, 1);
    setProjects(updatedProjects);

    setIsLoading(false);
  };

  return (
    
    <div className="bg-gradient-to-r from-lavender to-white min-h-screen">
      {/* Navbar */}
      <Navbar />
      {/* Form Section */}
      <section className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="bg-gray-100 rounded-lg p-8 w-1/2 mb-10 mt-10">
          <h2 className="text-2xl text-center text-gray-800 mb-8">Projects</h2>
          <div className="mb-6">

            {projects.map((project, projectIndex) => (
              <div key={projectIndex} className="mb-6">
                <div className="mb-4">
                  <label htmlFor={`project-name-${projectIndex}`} className="block text-gray-800 font-medium mb-2">
                    Name:
                  </label>
                  <input
                    type="text"
                    id={`project-name-${projectIndex}`}
                    value={project.name}
                    onChange={(event) =>
                      handleProjectChange(projectIndex, 'name', event.target.value)
                    }
                    className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-200 text-black"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor={`project-description-${projectIndex}`} className="block text-gray-800 font-medium mb-2">
                    Description:
                  </label>
                  <textarea
                    id={`project-description-${projectIndex}`}
                    value={project.description}
                    onChange={(event) =>
                      handleProjectChange(projectIndex, 'description', event.target.value)
                    }
                    className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-200 text-black"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor={`project-image-${projectIndex}`} className="block text-gray-800 font-medium mb-2">
                    Image:
                  </label>
                  <input
                    type="file"
                    id={`project-image-${projectIndex}`}
                    accept="image/*"
                    onChange={(event) => handleImageUpload(projectIndex, event)}
                    className="py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>


                <div className="mb-4">
                  <label htmlFor={`project-name-${projectIndex}`} className="block text-gray-800 font-medium mb-2">
                    Source code link:
                  </label>
                  <input
                    type="text"
                    id={`project-name-${projectIndex}`}
                    value={project.source_code_link}
                    onChange={(event) =>
                      handleProjectChange(projectIndex, 'source_code_link', event.target.value)
                    }
                    className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-200 text-black"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor={`project-name-${projectIndex}`} className="block text-gray-800 font-medium mb-2">
                    Demo link:
                  </label>
                  <input
                    type="text"
                    id={`project-name-${projectIndex}`}
                    value={project.demo_link}
                    onChange={(event) =>
                      handleProjectChange(projectIndex, 'demo_link', event.target.value)
                    }
                    className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-200 text-black"
                  />
                </div>
                  
                
                <div className="mb-4">
                  <label htmlFor={`tech-stacks-${projectIndex}`} className="block text-gray-800 font-medium mb-2">
                    Tech Stacks:
                  </label>
                  {project.techStacks.map((techStack, stackIndex) => (
                    <div key={stackIndex} className="flex mb-2">
                      <input
                        type="text"
                        id={`tech-stack-${stackIndex}-${projectIndex}`}
                        value={techStack.name}
                        onChange={(event) =>
                          handleTechStackChange(projectIndex, stackIndex, event.target.value)
                        }
                        className="flex-1 py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-200 text-black"
                      />
                      <button
                        type="button"
                        onClick={() => removeTechStack(projectIndex, stackIndex)}
                        className="ml-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 focus:outline-none transition duration-300"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  {project.techStacks.length < 3 && (
                    <button
                      type="button"
                      onClick={() => addTechStack(projectIndex)}
                      className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 focus:outline-none transition duration-300"
                    >
                      Add Tech Stack
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => saveProject(projectIndex)}
                  className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 focus:outline-none transition duration-300"
                >
                  Save Project
                </button>
                <button
                  type="button"
                  onClick={() => removeProject(projectIndex)}
                  className="px-4 py-2 ml-2 bg-red-500 text-white rounded-lg hover:bg-red-700 focus:outline-none transition duration-300"
                >
                  Remove Project
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addProject}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 focus:outline-none transition duration-300"
            >
              Add Project
            </button>
          </div>
        
        {isLoading && (
            <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-opacity-50 bg-gray-900">
              <div className="loader"> Processing Request...</div>
            </div>
          )}
        
        </div>
      </section>
      <ToastContainer /> 
    </div>
  );
};

export default Projects;


