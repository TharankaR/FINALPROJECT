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
