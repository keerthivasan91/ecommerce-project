import React, { useEffect, useState } from "react";
import { getUsers } from "../../services/userService";

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers().then((res) => setUsers(res.data));
  }, []);

  return (
    <div>
      <h2>User List</h2>
      <ul>
        {users.map((u) => (
          <li key={u.user_id}>{u.username} - {u.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
