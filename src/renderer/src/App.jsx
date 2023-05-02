import axios from "axios";
import React, {useEffect, useState} from "react";
import {format} from 'date-fns';
import {fr} from 'date-fns/locale';

function App() {
  const [partsOfDays, setPartsOfDays] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:1337/api/parts-of-days?populate=*")
      .then((response) => {
        setPartsOfDays(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const exportPartsOfDays = () => {

    const exportData = partsOfDays.map(
      (partOfDay) => `${partOfDay.attributes.scenario.data.attributes.title}, ${format(new Date(partOfDay.attributes.day), 'dd MMMM yyyy', {locale: fr})}, ${format(new Date(partOfDay.attributes.day), 'HH:mm', {locale: fr})}, ${partOfDay.attributes.status}\n`
    );
    const dataBlob = new Blob([exportData], {type: "text/plain"});
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "partsOfDays.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const reloadPartsOfDays = () => {
    axios
      .get("http://localhost:1337/api/parts-of-days?populate=*")
      .then((response) => {
        setPartsOfDays(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const zoomIn = () => {
    const container = document.querySelector(".container");
    const currentZoom = container.style.zoom || "100%";
    const newZoom = parseInt(currentZoom) + 10;
    container.style.zoom = `${newZoom}%`;
  };

  const zoomOut = () => {
    const container = document.querySelector(".container");
    const currentZoom = container.style.zoom || "100%";
    const newZoom = parseInt(currentZoom) - 10;
    container.style.zoom = `${newZoom}%`;
  };

  const updatePartOfDayStatus = (partOfDayId, newStatus) => {
    axios
      .put(`http://localhost:1337/api/parts-of-days/${partOfDayId}`, {
        status: newStatus
      })
      .then(() => {
        reloadPartsOfDays();
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const stopPartOfDay = (partOfDayId) => {
    if (window.confirm("Are you sure you want to stop this part of day?")) {
      axios
        .delete(`http://localhost:1337/api/parts-of-days/${partOfDayId}`)
        .then(() => {
          reloadPartsOfDays();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handleStatusChange = (partOfDayId, partOfDay) => {
    const updatedPartOfDay = {
      data: {
        id: partOfDayId,
        day: partOfDay.attributes.day,
        scenario: partOfDay.attributes.scenario,
        status: partOfDay.attributes.status === "not_started" ? "in_progress" : "completed",
      }
    };
    axios
      .put(`http://localhost:1337/api/parts-of-days/${partOfDayId}`, updatedPartOfDay)
      .then(() => {
        reloadPartsOfDays();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const restartParty = (partOfDayId, partOfDay) => {
    const updatedPartOfDay = {
      data: {
        id: partOfDayId,
        day: partOfDay.attributes.day,
        scenario: partOfDay.attributes.scenario,
        status: partOfDay.attributes.status = "not_started",
      }
    };
    axios
      .put(`http://localhost:1337/api/parts-of-days/${partOfDayId}`, updatedPartOfDay)
      .then(() => {
        reloadPartsOfDays();
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const goToApiUrl = () => {
    window.location.href = "http://localhost:1337/";
  };


  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Liste des parties de la journée</h1>
      <div className="flex justify-between items-center mb-8">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
                  onClick={exportPartsOfDays}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                 stroke="currentColor" className="w-6 h-6 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round"
                    d="M12 9.75v6.75m0 0l-3-3m3 3l3-3m-8.25 6a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"/>
            </svg>
            Exporter
          </button>
          <button type="button"
                  class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
                  onClick={reloadPartsOfDays}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                 stroke="currentColor" className="w-6 h-6 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>
            </svg>
            Recharger
          </button>
          <button type="button"
                  class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
                  onClick={zoomIn}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                 stroke="currentColor" className="w-6 h-6 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"/>
            </svg>
            Zoomer
          </button>
          <button type="button"
                  class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
                  onClick={zoomOut}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                 stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6"/>
            </svg>

            Dézoomer
          </button>
          <button type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-r-md hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
                  onClick={goToApiUrl}>Aller
            sur l'URL de votre API
          </button>
        </div>
      </div>
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Scénarios
            </th>
            <th scope="col" className="px-6 py-3">
              Date
            </th>
            <th scope="col" className="px-6 py-3">
              Temps
            </th>
            <th scope="col" className="px-6 py-3">
              Actions
            </th>
            <th scope="col" className="px-6 py-3">
              Supprimer
            </th>
          </tr>
          </thead>
          <tbody>
          {partsOfDays.map((partOfDay) => (
            <tr key={partOfDay.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {partOfDay.attributes.scenario.data.attributes.title}
              </th>
              <td className="px-6 py-4">
                {format(new Date(partOfDay.attributes.day), 'dd MMMM yyyy', {locale: fr})}
              </td>
              <td className="px-6 py-4">
                {format(new Date(partOfDay.attributes.day), 'HH:mm', {locale: fr})}
              </td>
              <td className="px-6 py-4">
                {partOfDay.attributes.status === "not_started" ? (
                  <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                          onClick={() => handleStatusChange(partOfDay.id, partOfDay)}>
                    Commencer
                  </button>
                ) : partOfDay.attributes.status === "in_progress" ? (
                  <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                          onClick={() => handleStatusChange(partOfDay.id, partOfDay)}>
                    Finir
                  </button>
                ) : (
                  <span className="text-green-600">Complété</span>
                )}
              </td>
              <td className="py-2 px-4 border">
                {partOfDay.attributes.status === "completed" ? (
                  <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                          onClick={() => restartParty(partOfDay.id, partOfDay)}
                  >
                    Relancer
                  </button>) : null}
                <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={() => stopPartOfDay(partOfDay.id)}>Supprimer
                </button>
              </td>
            </tr>))}
          </tbody>
        </table>
      </div>
    </div>
  )
    ;
}

export default App;
