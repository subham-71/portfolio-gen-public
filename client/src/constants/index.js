const base_url = "https://portfolio-gen-backend.onrender.com";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Work",
  },
  {
    id:"projects",
    title:"Projects",
  },
  {
    id: "contact",
    title: "Contact",
  },
];
const getAbout = async (clientId) => {
  try {
    const url = `${base_url}/home/getAbout`
    const response = await fetch(url,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "clientId": clientId,
        }),
      });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

const getProjects = async (clientId) => {
  try {
    const url = `${base_url}/projects/getProjects`
    const response = await fetch(url,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "clientId": clientId,
        }),
      });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const getExperiences = async (clientId) => {
  try {
    const url = `${base_url}/exp/getExps`
    const response = await fetch(url,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "clientId": clientId,
        }),
      });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const getContacts = async (clientId) => {
  try {
    const url = `${base_url}/contact/getContact`
    const response = await fetch(url,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "clientId": clientId,
        }),
      });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};


export {getAbout, getExperiences,getProjects ,getContacts};
