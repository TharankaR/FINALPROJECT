import React from "react";
import { FiTrash } from "react-icons/fi";
import styled from "styled-components";

const DeleteActions = ({ _id, handleDelete }) => {
  return (
    <div>
      <Delete onClick={() => handleDelete(_id)}>
        <FiTrash />
      </Delete>
    </div>
  );
};

const Delete = styled.button`
  cursor: pointer;
  border: none;
  background-color: white;
  margin-left: 220px;
`;

export default DeleteActions;
