import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ import navigator
import { useChatStore } from "../store/useChatStore";
import Avatar from "../components/Avatar";

const Discover = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { discoverableUsers, getDiscoverableUsers, setSelectedUser } =
    useChatStore();
  const navigate = useNavigate(); // ✅ instantiate navigator

  useEffect(() => {
    getDiscoverableUsers();
  }, []);

  const filteredUsers = discoverableUsers.filter((user) =>
    user.fullname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 pt-20 max-w-5xl">
      <h2 className="text-2xl font-bold mb-4">Discover New People</h2>
      <input
        type="text"
        placeholder="Search users..."
        className="input input-bordered w-full mb-6"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="card bg-secondary shadow-sm shadow-black p-4 rounded-lg flex flex-col items-center"
          >
            <Avatar user={user} image={user?.profilePic} size="lg" />
            <h3 className="font-semibold text-center">{user.fullname}</h3>
            <button
              className="btn btn-primary btn-sm mt-2"
              onClick={() => {
                setSelectedUser(user); // ✅ set context
                navigate("/"); // ✅ then navigate to home
              }}
            >
              Start Chat
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Discover;
