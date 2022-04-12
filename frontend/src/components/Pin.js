import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Room, Star, FavoriteBorder } from "@material-ui/icons";
import { format } from "timeago.js";
import Map, { Marker, Popup } from "react-map-gl";
import LikeActions from "./LikeActions";
import Register from "./Register";
import Login from "./Login";

const Pin = () => {
  const [currentUser, setCurrentUser] = useState(
    window.localStorage.getItem("user")
  );
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("/pins");
        setPins(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
  };

  const handleAddClick = (e) => {
    console.log(Object.values(e.lngLat));
    const positions = Object.values(e.lngLat);
    setNewPlace({
      long: positions[0],
      lat: positions[1],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long,
      numLiked: 0,
    };

    try {
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("user");
    setCurrentUser(null);
  };
  return (
    <div>
      <Map
        initialViewState={{
          longitude: -15,
          latitude: 40,
          // longitude: 17,
          // latitude: 47,
          zoom: 2,
        }}
        style={{
          width: "100vw",
          height: "100vh",
          position: "relative",
          zIndex: "1",
        }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        onDblClick={handleAddClick}
      >
        {pins.map((p) => (
          <>
            <Marker latitude={p.lat} longitude={p.long} anchor="bottom">
              <Room
                //pin
                style={{
                  fontSize: "zoom*50",
                  color: p.username === currentUser ? "tomato " : "blue",
                  cursor: "pointer",
                }}
                onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
              />
            </Marker>
            {p._id === currentPlaceId && (
              <Popup
                //pinned Review Card
                longitude={p.long}
                latitude={p.lat}
                closeButton={true}
                closeOnClick={false}
                anchor="left"
                onClose={() => setCurrentPlaceId(null)}
              >
                <div className="card">
                  <label for="place">Place</label>
                  <h4 className="place" name="place">
                    {p.title}
                    {console.log(p)}
                  </h4>
                  <label>Review</label>
                  <p className="desc"> {p.desc}</p>
                  <label>Rating</label>
                  <div className="stars">
                    {Array(p.rating).fill(<Star className="star" />)}
                  </div>
                  <label>Information</label>
                  <span className="username">
                    {" "}
                    Created by <b>{p.username}</b>
                  </span>
                  <span className="date"> {format(p.createdAt)}</span>
                </div>
                {/* <FavoriteBorder
                  fill={isLiked ? "red" : "white"}
                  // onClick={handleLikeIcon}
                  style={{ color: isLiked ? "red" : "black" }}
                />
                {isLiked ? " 1" : ""} */}
                <LikeActions />
              </Popup>
            )}
          </>
        ))}

        {newPlace && (
          //to add a new place
          <Popup
            latitude={newPlace.lat}
            longitude={newPlace.long}
            closeButton={true}
            closeOnClick={false}
            anchor="left"
            onClose={() => setNewPlace(null)}
          >
            <div>
              <form onSubmit={(e) => handleSubmit(e)}>
                <label>Title</label>
                <input
                  placeholder="Enter a title"
                  onChange={(e) => setTitle(e.target.value)}
                />
                <label>Review</label>
                <textarea
                  placeholder="Say something about this place"
                  onChange={(e) => setDesc(e.target.value)}
                />
                <label>Rating</label>
                <select onChange={(e) => setRating(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button className="submitButton" type="submit">
                  Add Pin
                </button>
              </form>
            </div>
          </Popup>
        )}
        <div style={{ zIndex: "1", position: "relative" }}>
          {currentUser ? (
            <button className="button logout" onClick={handleLogout}>
              Log out
            </button>
          ) : (
            <div className="buttons">
              <button
                className="button login"
                onClick={() => setShowLogin(true)}
              >
                Log in
              </button>
              <button
                className="button register"
                onClick={() => setShowRegister(true)}
              >
                Register
              </button>
            </div>
          )}
          {showRegister && <Register setShowRegister={setShowRegister} />}
          {showLogin && (
            <Login
              setShowLogin={setShowLogin}
              setCurrentUser={setCurrentUser}
            />
          )}
        </div>
      </Map>
    </div>
  );
};

export default Pin;
