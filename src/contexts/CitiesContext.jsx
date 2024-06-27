import { useContext } from "react";
import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

const BASE_URL = "http://localhost:9000";

const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});

  useEffect(() => {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        setCities(data);
      } catch (error) {
        alert("there was an error: " + error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCities();
  }, []);

  async function getCity(id) {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      setCurrentCity(data);
      console.log(currentCity);
    } catch (error) {
      alert("there was an error: " + error);
    } finally {
      setIsLoading(false);
    }
  }

  async function createCity(newCity) {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      setCities((cities) => [...cities, data]);
    } catch (error) {
      alert("there was an error creating the city: " + error);
    } finally {
      setIsLoading(false);
    }
  }
  
  async function deleteCity(cityId) {
    try {
      setIsLoading(true);
      await fetch(`${BASE_URL}/cities/${cityId}`, {
        method: "DELETE",
      });

      setCities((cities) => cities.filter(city => city.id !== cityId));
    } catch (error) {
      alert("there was an error deleting the city: " + error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside the CitiesProvider");

  return context;
}

CitiesProvider.propTypes = {
  children: PropTypes.any,
};

export { CitiesProvider, useCities };
