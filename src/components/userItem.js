import { useDrag } from 'react-dnd';

export default function UserItem( {name, id} ) {
  const [{ isDragging }, drag] = useDrag({
    type: "user",
    item: { type: 'USER', name },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const border = isDragging ? "5px solid pink" : "0px";

  return (
    <div ref={drag} style={{ border }}>
      <p>{name.userName}</p>
    </div>
  );
};


