import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { storage } from '../config/firebaseConfig';
import Navbar from './Navbar';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Experiences = () => {
  const { currentUser } = useAuth();
  const [experiences, setExperiences] = useState([]);
   const [isLoading, setIsLoading] = useState(false);
  const base_url = "https://portfolio-gen-backend.onrender.com";

  // Fetch data from API and populate form fields
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${base_url}/exp/getExps`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "clientId": currentUser.uid,
          }),
        });
        const data = await response.json();
        setExperiences(data || []);
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


   const addExperience = () => {
    setExperiences([...experiences, {
      name: uuidv4(),
      title: '',
      company_name: '',
      icon: '',
      date: '',
      points: []
    }]);
  };
const saveExperience = async (index) => {
    setIsLoading(true);
    const exp = experiences[index];
    const data = {
      name: exp.name,
      clientId: currentUser.uid,
      exp: exp,
    };

    try {
      const response = await fetch(`${base_url}/exp/addExp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      if (responseData._writeTime) {
        notifySuccess("Saved successfully");
      } else {
        notifyError('Failed to save experience.');
      }
    } catch (error) {
      console.error('Error sending data:', error);
      notifyError('An error occurred while saving experience.');
    }
    setIsLoading(false);
  };

  const removeExperience = async (index) => {
    setIsLoading(true);
    const data = {
      name: experiences[index].name,
      clientId: currentUser.uid,
    };

    try
      {
        const delIcon = storage.refFromURL(experiences[index].icon);
        await delIcon.delete();
      }
      catch (error) {
      }

    try {
      const response = await fetch(`${base_url}/exp/removeExp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      if (responseData._writeTime) {
        notifySuccess("Saved successfully");
      } else {
        notifyError('Failed to remove experience.');
      }
    } catch (error) {
      console.error('Error sending data:', error);
      notifyError('An error occurred while removing experience.');
    }

    const updatedExperiences = [...experiences];
    updatedExperiences.splice(index, 1);
    setExperiences(updatedExperiences);
    setIsLoading(false);
  };

  const addPoint = (experienceIndex) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[experienceIndex].points.push('');
    setExperiences(updatedExperiences);
  };

  const removePoint = (experienceIndex, taskIndex) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[experienceIndex].points.splice(taskIndex, 1);
    setExperiences(updatedExperiences);
  };

    const handlePointChange = (experienceIndex, taskIndex, value) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[experienceIndex].points[taskIndex] = value;
    setExperiences(updatedExperiences);
  };

  const handleExperienceChange = (index, field, value) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[index][field] = value;
    setExperiences(updatedExperiences);
  };

   const handleImageUpload = async (experienceIndex, event) => {
    setIsLoading(true);

    const file = event.target.files[0];
    const storageRef = storage.ref();
    const id = uuidv4();
    const filename = id.concat(file.name);
    const fileRef = storageRef.child(`${currentUser.uid}/experiences/${filename}`);

    try {
      await fileRef.put(file);
      const downloadURL = await fileRef.getDownloadURL();

      const updatedExperiences = [...experiences];
      updatedExperiences[experienceIndex].icon = downloadURL;
      setExperiences(updatedExperiences);
      setIsLoading(false);
    } catch (error) {
      console.error('Error uploading image:', error);
      notifyError('An error occurred while uploading the image.');
      setIsLoading(false);
    }
  };


  return (
    <div className="bg-gradient-to-r from-lavender to-white min-h-screen">
      {/* Navbar */}
      <Navbar />
      {/* Form Section */}
      <section className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="bg-gray-100 rounded-lg p-8 w-1/2 mb-10 mt-10">
          <h2 className="text-2xl text-center text-gray-800 mb-8">Work Experiences</h2>

          <div className="mb-6">
            {experiences.map((experience, experienceIndex) => (
              <div key={experienceIndex} className="mb-6">
                <div className="mb-4">
                  <label htmlFor={`title-${experienceIndex}`} className="block text-gray-800 font-medium mb-2">
                    Title:
                  </label>
                  <input
                    type="text"
                    id={`title-${experienceIndex}`}
                    value={experience.title}
                    onChange={(event) =>
                      handleExperienceChange(experienceIndex, 'title', event.target.value)
                    }
                    className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-200 text-black"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor={`company-name-${experienceIndex}`} className="block text-gray-800 font-medium mb-2">
                    Company Name:
                  </label>
                  <input
                    type="text"
                    id={`company-name-${experienceIndex}`}
                    value={experience.company_name}
                    onChange={(event) =>
                      handleExperienceChange(experienceIndex, 'company_name', event.target.value)
                    }
                    className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-200 text-black"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor={`icon-${experienceIndex}`} className="block text-gray-800 font-medium mb-2">
                    Icon:
                  </label>
                  <input
                    type="file"
                    id={`icon-${experienceIndex}`}
                    accept="image/*"
                    onChange={(event) => handleImageUpload(experienceIndex, event)}
                    className="py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor={`date-${experienceIndex}`} className="block text-gray-800 font-medium mb-2">
                    Date:
                  </label>
                  <input
                    type="text"
                    id={`date-${experienceIndex}`}
                    value={experience.date}
                    onChange={(event) =>
                      handleExperienceChange(experienceIndex, 'date', event.target.value)
                    }
                    className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-200 text-black"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor={`points-${experienceIndex}`} className="block text-gray-800 font-medium mb-2">
                    Tasks performed:
                  </label>
                  {experience.points.map((task, taskIndex) => (

                    <div key={taskIndex} className="flex mb-2">
                      <textarea
                        
                        id={`task-${taskIndex}-${experienceIndex}`}
                        value={task}
                        onChange={(event) =>
                          handlePointChange(experienceIndex, taskIndex, event.target.value)
                        }
                        className="flex-1 py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-200 text-black"
                      />
                      <button
                        type="button"
                        onClick={() => removePoint(experienceIndex, taskIndex)}
                        className="ml-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 focus:outline-none transition duration-300"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addPoint(experienceIndex)}
                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 focus:outline-none transition duration-300"
                  >
                    Add Point
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => saveExperience(experienceIndex)}
                  className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-900 focus:outline-none transition duration-300"
                >
                  Save Experience
                </button>
                <button
                  type="button"
                  onClick={() => removeExperience(experienceIndex)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 focus:outline-none ml-2 transition duration-300"
                >
                  Remove Experience
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addExperience}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 focus:outline-none transition duration-300"
            >
              Add Experience
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

export default Experiences;
