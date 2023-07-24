import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from './Navbar';
import { storage } from '../config/firebaseConfig';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const base_url = 'https://portfolio-gen-backend.onrender.com';

const Home = () => {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [about, setAbout] = useState({
    name: '',
    email: '',
    intro: '',
    overview: '',
    services: [],
  });

   useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${base_url}/home/getAbout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "clientId": currentUser.uid,
          }),
        });
        const data = await response.json();
        setAbout(data[0] || []);
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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAbout((prevAbout) => ({ ...prevAbout, [name]: value }));
  };

const addService = () => {
  setAbout((prevAbout) => {
    if (prevAbout && prevAbout.services) {
      return {
        ...prevAbout,
        services: [...prevAbout.services, { name: '' }],
      };
    } else {
      return {
        services: [{ name: '' }],
      };
    }
  });
};


  const removeService = async(index) => {
    setIsLoading(true);

    try{

      if(about.services[index].icon) {
        const delIcon = storage.refFromURL(about.services[index].icon);
        await delIcon.delete();
      }
    }
    catch (error) {
    }

    setAbout((prevAbout) => {
      const updatedServices = [...prevAbout.services];
      updatedServices.splice(index, 1);
      return { ...prevAbout, services: updatedServices };
    });
    setIsLoading(false);
  };

  const handleServiceChange = (index, field, value) => {

    setAbout((prevAbout) => {
      const updatedServices = [...prevAbout.services];
      updatedServices[index][field] = value;
      return { ...prevAbout, services: updatedServices };
    });
  };

  const handleImageUpload = async (serviceIndex, event) => {
    setIsLoading(true);
    const file = event.target.files[0];
    const storageRef = storage.ref();
    const id = uuidv4();
    const filename = id.concat(file.name);
    const fileRef = storageRef.child(`${currentUser.uid}/services/${filename}`);

    try {
      if (about.services[serviceIndex].icon) {
      const currentFileRef = storage.refFromURL(about.services[serviceIndex].icon);
      await currentFileRef.delete();
    }
    }
    catch (error) {
     
    } 

    
    try{
      await fileRef.put(file);
      const downloadURL = await fileRef.getDownloadURL();
      

      setAbout((prevAbout) => {
      const updatedServices = [...prevAbout.services];
      updatedServices[serviceIndex].icon = downloadURL;
      return { ...prevAbout, services: updatedServices };
      });
      setIsLoading(false);
    }
    catch (error) {
      console.error('Error uploading image:', error);
      notifyError('An error occurred while uploading the image.');
      setIsLoading(false);
    }
    

  };


  const handleSave = async() => {
    setIsLoading(true);

    const data = {
      "about": about,
      "clientId": currentUser.uid,
    };


    try {
      const response = await fetch(`${base_url}/home/addAbout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      if (responseData._writeTime) {
        notifySuccess("Saved successfully");
      } else {
        notifyError('Failed to save data.');
      }
    } catch (error) {
      console.error('Error sending data:', error);
       notifyError('An error occurred while saving data.');
    }

    setIsLoading(false);

  };

  return (
    <div className="bg-gradient-to-r from-lavender to-white min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Form Section */}
      <section className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="bg-gray-800 text-white p-8 rounded-lg mt-5">
          <p className="text-lg text-center">
            Wondering where your portfolio will be hosted at? <br></br>
            <a
              href={`/${currentUser.uid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-500 font-medium"
            >
              Fill in the forms and Check it out here!
            </a>
          </p>
        </div>

        <div className="bg-gray-100 rounded-lg p-8 w-1/2 mb-10 mt-5">
          <h2 className="text-2xl text-center text-gray-800 mb-8">Introduction</h2>

          <div className="mb-6">
            <label htmlFor="name" className="block text-gray-800 font-medium mb-2">
              First Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={about.name}
              onChange={handleInputChange}
              className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-200 text-black"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-800 font-medium mb-2">
              Email :
               <br />
              <span className="text-sm text-gray-500 mt-2"> (for receiving communications through your portfolio) </span>
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={about.email}
              onChange={handleInputChange}
              className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-200 text-black"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="intro" className="block text-gray-800 font-medium mb-2">
              Short Intro:
            </label>
            <textarea
              id="intro"
              name="intro"
              value={about.intro}
              onChange={handleInputChange}
              className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-200 text-black"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="overview" className="block text-gray-800 font-medium mb-2">
              Overview:
            </label>
            <textarea
              id="overview"
              name="overview"
              value={about.overview}
              onChange={handleInputChange}
              className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-200 text-black"
            />
          </div>

          <h2 className="text-2xl text-center text-gray-800 mb-4">Services</h2>

          {(about?.services || []).map((service, index) => (
            <div key={index} className="mb-6">
              <div className="mb-4">
                <label htmlFor={`service-name-${index}`} className="block text-gray-800 font-medium mb-2">
                  Service Name:
                </label>
                <input
                  type="text"
                  id={`service-name-${index}`}
                  name={`service-name-${index}`}
                  value={service.name}
                  onChange={(event) => handleServiceChange(index, 'name', event.target.value)}
                  className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-200 text-black"
                />
              </div>

              <div className="mb-4">
                  <label htmlFor={`service-icon-${index}`} className="block text-gray-800 font-medium mb-2">
                    Icon:
                  </label>
                  <input
                    type="file"
                    id={`service-icon-${index}`}
                    name={`service-icon-${index}`}
                    accept="image/*"
                    onChange={(event) => handleImageUpload(index, event)}
                    className="py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

              <button
                type="button"
                onClick={() => removeService(index)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 focus:outline-none transition duration-300"
              >
                Remove Service
              </button>
            </div>
          ))}

          {(about?.services?.length || 0) < 4 && (
            <button
              type="button"
              onClick={addService}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 focus:outline-none transition duration-300"
            >
              Add Service
            </button>
          )}

          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 focus:outline-none transition duration-300"
            >
              Save
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

export default Home;
