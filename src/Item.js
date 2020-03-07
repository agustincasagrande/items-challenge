import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
const style = {
  border: "1px dashed gray",
  padding: "0.5rem 1rem",
  marginBottom: ".5rem",
  backgroundColor: "white",
  cursor: "move"
};
const type = "item";
const Item = ({ data, index, moveItem, edit, removeItem, saveItem }) => {
  const ref = useRef(null);
  const [, drop] = useDrop({
    accept: type,
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveItem(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    }
  });
  const [{ isDragging }, drag] = useDrag({
    item: { type, id: data.id, index },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });
  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));
  return (
    <li ref={ref} key={data.id} className="tool" style={{ ...style, opacity }}>
      {edit.id === data.id ? (
        <input
          value={edit.text || data.text}
          onChange={e => {
            e.preventDefault();
            setEdit({ ...edit, text: e.target.value });
          }}
        />
      ) : (
        <p>{data.text}</p>
      )}

      {data.image && <img src={data.image} />}
      <span className="delete" onClick={() => removeItem(data.id)}></span>
      {edit.id !== data.id ? (
        <button
          className="edit-button"
          onClick={() => setEdit({ id: data.id })}
        >
          Edit
        </button>
      ) : (
        <div className="edit-actions">
          <span onClick={saveItem}>
            <button className="save-button">Save</button>
          </span>
          <span onClick={() => setEdit(false)}>
            <button className="cancel-button">Cancel</button>
          </span>
        </div>
      )}
    </li>
  );
};
export default Item;
