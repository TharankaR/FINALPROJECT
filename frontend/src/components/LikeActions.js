import React, { useState } from "react";
import styled from "styled-components";
import { FavoriteBorder } from "@material-ui/icons";
import { FiHeart } from "react-icons/fi";

const LikeActions = ({ _id, liked }) => {
  const [isLiked, setIsLiked] = useState(liked);
  const [numLike, setNumLike] = useState(0);

  const handleLike = () => {
    fetch(`/api/pins/`, {
      method: "PUT",
      body: JSON.stringify({ like: !isLiked }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(() => setIsLiked(!isLiked))
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div>
      <HeartButton>
        <FiHeart
          fill={isLiked ? "red" : "white"}
          onClick={handleLike}
          style={{ color: isLiked ? "red" : "black" }}
        />
        {isLiked ? "1" : ""}
      </HeartButton>
    </div>
  );
};

const HeartButton = styled.button`
  border: none;
  cursor: pointer;
  background-color: white;
`;

export default LikeActions;
