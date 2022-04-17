import * as React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import "mapbox-gl/dist/mapbox-gl.css";
import "./app.css";
import { format } from "timeago.js";
import { Room, Star, FavoriteBorder } from "@material-ui/icons";
import Map, { Marker, Popup } from "react-map-gl";
import Register from "./components/Register";
import Login from "./components/Login";
import LikeActions from "./components/LikeActions";

function App() {
  const [currentUser, setCurrentUser] = useState(
    window.localStorage.getItem("user")
  );
  const [currentUserId, setCurrentUserId] = useState(
    window.localStorage.getItem("userId")
  );
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const [numOfLikes, setNumOfLikes] = useState(0);

  const [isLiked, setIsLiked] = useState(null);

  const [numLike, setNumLike] = useState(null);

  console.log(process.env.REACT_APP_MAPBOX);

  useEffect(() => {
    fetch("/pins")
      .then((res) => res.json())
      .then((data) => {
        setPins(data.data);
        console.log(data.data);
      });
  }, [isLiked]);

  // useEffect(() => {
  //   const getPins = async () => {
  //     try {
  //       const res = await fetch("/pins");
  //       // const res = await axios.get("/pins");
  //       console.log(res);
  //       // setPins(res.data);
  //       const listPins = await res.json();
  //       console.log(listPins);
  //       return listPins;
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   getPins().then((listPins) => setPins(listPins.data));
  //   console.log(pins);
  // }, []);
  const setTrue = () => {
    setIsLiked(true);
    setNumLike(-1);
  };

  const setFalse = () => {
    setIsLiked(false);
    setNumLike(+1);
  };
  const handleMarkerClick = (p) => {
    setCurrentPlaceId(p._id);
    p.likes.includes(currentUserId) ? setTrue() : setFalse();
  };

  const handleAddClick = (e) => {
    console.log(e);
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
      numOfLikes,
    };

    try {
      const res = await axios.post("/pins", newPin);
      console.log("CONNECTED");
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
  console.log(pins);
  console.log(isLiked);

  const handleLike = (_id) => {
    console.log(isLiked);
    console.log(numLike);
    // console.log(currentUser);

    fetch(`/pins/${_id}/like`, {
      method: "PATCH",
      body: JSON.stringify({ currentUser, numLike, currentUserId }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(() => {
        setIsLiked(!isLiked);
        setNumLike(numLike === 1 ? -1 : 1);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    pins && (
      <div className="App">
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
          onDblClick={(e) => handleAddClick(e)}
        >
          {pins &&
            pins?.map((p) => {
              // console.log(p.lat);
              return (
                <>
                  <Marker
                    latitude={Number(p.lat)}
                    longitude={Number(p.long)}
                    anchor="bottom"
                  >
                    <Room
                      //pin
                      style={{
                        fontSize: "zoom*50",
                        color: p.username === currentUser ? "tomato " : "blue",
                        cursor: "pointer",
                      }}
                      onClick={() => handleMarkerClick(p)}
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
                        <label htmlFor="place">Place</label>
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
                        <span className="numLikes">
                          Number of likes: <b>{p.numOfLikes}</b>
                        </span>
                      </div>
                      {console.log(p.likes?.includes(currentUserId))}
                      {console.log(currentUserId)}
                      {console.log(p.likes)}
                      {p.likes?.includes(currentUserId) ? (
                        <LikeActions
                          currentUser={currentUser}
                          _id={p._id}
                          liked={isLiked}
                          handleLike={handleLike}
                          currentUserId={currentUserId}
                        />
                      ) : (
                        <LikeActions
                          currentUser={currentUser}
                          _id={p._id}
                          liked={isLiked}
                          handleLike={handleLike}
                          currentUserId={currentUserId}
                        />
                      )}
                    </Popup>
                  )}
                </>
              );
            })}
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
          </div>{" "}
        </Map>
      </div>
    )
  );
}

export default App;

//react mag gl
// https://visgl.github.io/react-map-gl/docs/get-started/get-started
