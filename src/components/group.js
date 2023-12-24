import { useDrop } from 'react-dnd';

const Group = ({ name, items, onDrop, removeFromGroup }) => {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: 'user',
    drop: (item) => onDrop(item.name, name),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const isActive = canDrop && isOver;
  let backgroundColor = name;
  if (isActive) {
    backgroundColor = 'white';
  } 
//   else if (canDrop) {
//     backgroundColor = 'darkkhaki';
//   }

  return (
    <div className={name==='red'? "redTeam": "blueTeam"} ref={drop} style={{backgroundColor}}>
      {name === 'red'? 
      <h3>Red Team</h3> 
      :<h3>Blue Team</h3>
      
      }
      <>

        {items.map((item, index) => (
          <p className='removeButton'>{item.userName} <button  onClick={() => removeFromGroup(item, name)}>X</button></p>
          
        ))}
     </>
    </div>
  );
};

export default Group;
