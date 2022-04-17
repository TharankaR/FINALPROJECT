import React, { useState } from "react";
import styled from "styled-components";
import { FavoriteBorder } from "@material-ui/icons";
import { FiHeart } from "react-icons/fi";

const LikeActions = ({
  _id,
  currentUser,
  liked,
  currentUserId,
  handleLike,
}) => {
  // const [isLiked, setIsLiked] = useState(liked);
  // const [numLike, setNumLike] = useState(!liked ? 1 : -1);
  // console.log(_id);
  // console.log(numLike);
  // const handleLike = () => {
  //   console.log(liked);
  //   console.log(numLike);
  //   // console.log(currentUser);

  //   setLiked(!liked);
  //   setNumLike(liked ? 1 : -1);
  //   fetch(`/pins/${_id}/like`, {
  //     method: "PATCH",
  //     body: JSON.stringify({ currentUser, numLike, currentUserId }),
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   })
  //     .then((res) => res.json())
  //     .then(() => {})
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };
  return (
    <div onClick={() => handleLike(_id)}>
      <HeartButton>
        <FiHeart
          fill={liked ? "red" : "white"}
          style={{ color: liked ? "red" : "black" }}
        />
      </HeartButton>
    </div>
  );
};

const HeartButton = styled.button`
  border: none;
  cursor: pointer;
  background-color: white;
  font-size: 20px;
`;

export default LikeActions;
