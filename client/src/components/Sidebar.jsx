import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./SidebarSkeleton";
import { Users, Search, ScanSearch } from "lucide-react";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();

  //const { onlineUsers } = useAuthStore();
  const onlineUsers = [];
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.fullname
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesOnline = !showOnlineOnly || onlineUsers.includes(user._id);
    return matchesSearch && matchesOnline;
  });

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside
      className={`h-full lg:border-r-2 flex flex-col transition-all duration-200 bg-slate-800 text-accent ${
        selectedUser ? "hidden lg:flex" : "flex"
      } lg:w-80 w-full`}
    >
      <div className="border-b border-base-300 w-full p-4 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Users />
            <span className="font-medium hidden sm:block">Contacts</span>
          </div>
          {/* Online toggle - unchanged */}
          <div className="mt-3 flex items-center gap-2">
            <label className="cursor-pointer flex items-center gap-1 p-1 border bg-slate-200 rounded-full">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="checkbox checkbox-xs bg-primary"
              />
            </label>
            <span className="text-xs text-zinc-400">
              ({onlineUsers.length} online)
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-2 items-center px-3 pt-2">
        <Link to={"/discover"}>
          <ScanSearch
            className="hover:cursor-pointer hover:bg-base-100 rounded-lg"
            size={35}
          />
        </Link>
        {/* Search Input */}
        <div className="relative hidden lg:block w-full">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input w-full input-sm pl-10 bg-slate-700"
          />
          <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
        </div>
        {/* Mobile search (optional) */}
        <div className="py-2 lg:hidden w-full">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-sm w-full pl-9 bg-slate-700"
            />
            <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
          </div>
        </div>
      </div>

      {/* User list */}
      <div className="overflow-y-auto w-full p-4 flex flex-col-reverse gap-2">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
                w-full py-2 px-2 flex items-center gap-3 bg-slate-100
                hover:bg-slate-300 transition-colors
                ${
                  selectedUser?._id === user._id
                    ? "bg-base-300 ring-1 ring-base-300"
                    : ""
                }
              `}
            >
              {/* ... user avatar and online indicator */}
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="">
                  <Avatar
                    user={user}
                    image={user?.profilePic}
                    size="sm"
                    className=""
                  />
                </div>
                <div className="text-start">
                  <div className="font-medium truncate">{user.fullname}</div>
                  <div className="text-sm text-zinc-400">
                    {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                  </div>
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="text-center text-zinc-500 py-4">
            {isUsersLoading ? "Loading..." : "No users found"}
          </div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;
