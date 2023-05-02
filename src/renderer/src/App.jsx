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
      <h1 className="text-3xl font-bold mb-8">Liste des parties de la journée</h1>
      <div className="flex justify-between items-center mb-8">
        <div className="space-x-4">
          <button className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                  onClick={exportPartsOfDays}>Exporter
          </button>
          <button className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                  onClick={reloadPartsOfDays}>Recharger
          </button>
          <button className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600" onClick={zoomIn}>Zoomer
          </button>
          <button className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                  onClick={zoomOut}>Dézoomer
          </button>
          <button className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600" onClick={goToApiUrl}>Aller
            sur l'URL de votre API
          </button>
        </div>
      </div>
      <table className="w-full">
        <thead>
        <tr>
          <th className="py-2 px-4 bg-gray-100 border text-left">Scénarios</th>
          <th className="py-2 px-4 bg-gray-100 border text-left">Date</th>
          <th className="py-2 px-4 bg-gray-100 border text-left">Temps</th>
          <th className="py-2 px-4 bg-gray-100 border text-left">Action</th>
          <th className="py-2 px-4 bg-gray-100 border text-left">Supprimer</th>
        </tr>
        </thead>
        <tbody>
        {partsOfDays.map((partOfDay) => (
          <tr key={partOfDay.id}>
            <td className="py-2 px-4 border">{partOfDay.attributes.scenario.data.attributes.title}</td>
            <td
              className="py-2 px-4 border">{format(new Date(partOfDay.attributes.day), 'dd MMMM yyyy', {locale: fr})}</td>
            <td className="py-2 px-4 border">{format(new Date(partOfDay.attributes.day), 'HH:mm', {locale: fr})}</td>
            <td className="py-2 px-4 border">
              {partOfDay.attributes.status === "not_started" ? (
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={() => handleStatusChange(partOfDay.id, partOfDay)}
                >
                  Commencer
                </button>
              ) : partOfDay.attributes.status === "in_progress" ? (
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={() => handleStatusChange(partOfDay.id, partOfDay)}
                >
                  Finir
                </button>
              ) : (
                "Complété"
              )}
            </td>
            <td className="py-2 px-4 border">
              {partOfDay.attributes.status === "completed" ? (
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={() => restartParty(partOfDay.id, partOfDay)}
                >
                  Relancer
                </button>) : null}
              <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() => stopPartOfDay(partOfDay.id)}>Supprimer
              </button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
