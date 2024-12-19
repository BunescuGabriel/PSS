import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import BannerManager from './BannerManager';
import '../../styles/admin/SettingsA.css';
import CommentsManager from "./CommentsManager";
import CarsManager from "./CarsManager";
import RatingsManager from "./RatingManager";
import UsersManager from "./UsersManager";
import TermeniManager from "./TermeniManager";
import ConditiiManager from "./ConditiManager";
import CarsManagerr from "./CarCreate";
import CarsCreate from "./CarCreate";
import ServiciiManager from "./ServiciiManager";
import DespreManager from "./DespreManager";

const Meniul = () => {
  const [activeComponent, setActiveComponent] = useState(null);

  const showComponent = (componentName) => {
    setActiveComponent(componentName);
  };

  const [showList, setShowList] = useState(false);

  const toggleList = () => {
    setShowList(!showList);
  };

  return (
    <div className="admin-row">
      <div className="admin-container">
        <div className="settings-admin">
          <h1>
            Setări
            <FontAwesomeIcon icon={faCog} className="settings-icon" />
          </h1>
          <div className="control-buttons-container">
            <button className="control-button" onClick={() => showComponent('BannerManager')}>
              Bannere
            </button>
            <button className="control-button" onClick={() => showComponent('CarsManager')}>
              Mașini
            </button>
            <button className="control-button" onClick={() => showComponent('CommentsManager')}>
              Comentarii
            </button>
            <button className="control-button" onClick={() => showComponent('RatingsManager')}>
              Evaluări
            </button>
            <button className="control-button" onClick={() => showComponent('ServiciiManager')}>
              Servicii
            </button>
            <button className="control-button" onClick={() => showComponent('UsersManager')}>
              Utilizatori
            </button>
            <button className="control-button" onClick={() => showComponent('DespreManager')}>
              Despre Noi
            </button>
            <button className="control-button" onClick={toggleList}>
              Termeni și Condiții
            </button>
            {showList && (
              <ul className="control-button-tt">
                <button className="control-button-tc" onClick={() => showComponent('TermeniManager')}>
                  Termenii
                </button>
                <button className="control-button-tc" onClick={() => showComponent('ConditiiManager')}>
                  Condiții
                </button>
        </ul>
      )}
          </div>
        </div>
      </div>
      <div>
        {activeComponent === 'BannerManager' && <BannerManager />}
        {
          activeComponent === 'CarsManager' && (
            <div>
              <h1>Editarea Masinilor!!</h1>
              <CarsManager />
            </div>
          )
        }
        {
          activeComponent === 'CommentsManager' && (
            <div>
              <h1>Editarea Commentariilor pentru un produs anumit!!</h1>
              <CommentsManager />
            </div>
          )
        }
        {
          activeComponent === 'RatingsManager' && (
            <div>
              <h1>Editarea Ratingului pentru un produs anumit!!</h1>
              <RatingsManager />
            </div>
          )
        }
        {
          activeComponent === 'ServiciiManager' && (
            <div>
              <h1>Editarea Serviciilor prestate!!</h1>
              <ServiciiManager />
            </div>
          )
        }
        {
          activeComponent === 'UsersManager' && (
            <div>
              <h1>Editarea Userilor!!</h1>
              <UsersManager />
            </div>
          )
        }
        {
          activeComponent === 'DespreManager' && (
            <div>
              <h1>Editarea Despre noi!!</h1>
              <DespreManager />
            </div>
          )
        }
        {
          activeComponent === 'TermeniManager' && (
            <div>
              <h1>Editarea Termeni !!</h1>
              <TermeniManager />
            </div>
          )
        }
        {
          activeComponent === 'ConditiiManager' && (
            <div>
              <h1>Editarea Conditii !!</h1>
              <ConditiiManager />
            </div>
          )
        }
      </div>
    </div>
  );
};

export default Meniul;
