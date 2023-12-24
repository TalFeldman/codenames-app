import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import UserItem from './userItem';
import Group from './group';

export default function CreateGroups ( {usersList, socket, room} ) {

    const [users, setUsers] = useState(usersList);
    const [redTeam, setRedTeam] = useState([]);
    const [blueTeam, setBlueTeam] = useState([]);
    const [redCaptain, setRedCaptain] = useState();
    const [blueCaptain, setBlueCaptain] = useState();



    const handleDrop = (name, groupName) => {
        if (groupName === 'red') {
        setRedTeam((prev) => [...prev, name]);
        } else if (groupName === 'blue') {
        setBlueTeam((prev) => [...prev, name]);
        }
        setUsers((prev) => prev.filter((user) => user !== name));
    };

    const removeFromGroup = (name, groupName) => {
        if(groupName === 'red') {
            setRedTeam((prev) => prev.filter((user) => user !== name))
        } else if (groupName === 'blue') {
            setBlueTeam((prev) => prev.filter((user) => user !== name));
        }
        setUsers((prev) => [...prev, name])
    }

    const handleStart = () => {
        const gameDetails = {
            room: room,
            redTeam: redTeam,
            blueTeam: blueTeam,
            redCaptain: redCaptain,
            blueCaptain: blueCaptain,
          };
          socket.emit("start_game", gameDetails);


    }

    return (

        <DndProvider backend={HTML5Backend}>
        <div className="groupsContainer">
            <Group name="red" items={redTeam} onDrop={handleDrop} removeFromGroup={removeFromGroup} />
            <div className="start">
                {users.length > 0 ? (
                <div className="userList">
                <h3>Users</h3>
                {users.map((user) => (
                    <UserItem name={user}/>
                ))}
                </div>
                ):
                <div className="setGame">
                <select id="selectCaptain" required onChange={(e) => setRedCaptain(e.target.value)}>
                    <option value="">Select Captain For The Red Team</option>
                    {redTeam.map((user) => (
                        <option  key={user.userName} value={user.userName}>{user.userName}</option>
                    ))}
                </select>
                <select id="selectCaptain" required onChange={(e) => setBlueCaptain(e.target.value)}>
                    <option value="">Select Captain For The Blue Team</option>
                    {blueTeam.map((user) => (
                        <option key={user.userName} value={user.userName}>{user.userName}</option>
                    ))}
                </select>
                {redCaptain && blueCaptain?
                 <button onClick={handleStart}>Start</button>
                : ""}
                </div>
                }
            </div>
            <Group name="blue" items={blueTeam} onDrop={handleDrop} removeFromGroup={removeFromGroup} />
        </div>
        </DndProvider>

    )

}

