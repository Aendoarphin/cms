import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";

const process = { env: import.meta.env };

function App() {
  interface UserData {
    data: { email: string; username: string; role: string }[];
  }

  const [users, setUsers] = useState<UserData | null>(null);

  useEffect(() => {
    const getData = async () => {
      const response = await axios.get(`${process.env.VITE_HOST}/users/all`);
      setUsers(response.data);
    };
    getData();
  }, []);

  return (
    <>
      {users &&
        users.data.map((item: any) => (
          <div key={users.data.indexOf(item)}>
            <h3>User {users.data.indexOf(item)}</h3>
            <p>{item.email}</p>
            <p>{item.username}</p>
            <p>{item.role}</p>
          </div>
        ))}
    </>
  );
}

export default App;
