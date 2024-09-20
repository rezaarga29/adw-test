import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, searchUsers } from "../store/userSlice";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);
  const navigate = useNavigate();

  const [sortBy, setSortBy] = useState("firstName");
  const [order, setOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchUsers(sortBy, order));
  }, [dispatch, sortBy, order]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      dispatch(searchUsers(searchQuery));
    } else {
      dispatch(fetchUsers(sortBy, order));
    }
  };

  const handleDetailClick = (userId) => {
    navigate(`/user/${userId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-8">
          User Dashboard
        </h1>

        <div className="flex justify-center mb-6">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 border border-gray-300 rounded-l-md w-full"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-r-md"
            >
              Search
            </button>
          </form>
        </div>

        <div className="flex justify-center mb-6">
          <div className="mr-4">
            <label htmlFor="sortBy" className="mr-2 font-semibold">
              Sort By:
            </label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="firstName">First Name</option>
              <option value="lastName">Last Name</option>
              <option value="age">Age</option>
            </select>
          </div>
          <div>
            <label htmlFor="order" className="mr-2 font-semibold">
              Order:
            </label>
            <select
              id="order"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>

        {users.length === 0 ? (
          <p className="text-center text-gray-500">No users found...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div
                key={user.id}
                className="bg-white p-6 rounded-lg shadow-lg flex flex-col justify-between"
              >
                <div>
                  <img
                    src={user.image}
                    alt={user.firstName}
                    className="w-20 h-20 rounded-full mx-auto mb-4"
                  />
                  <h2 className="text-xl font-semibold text-center text-gray-800">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-center text-gray-500">
                    @{user.username} ({user.role})
                  </p>
                  <p className="text-center text-gray-500">{user.email}</p>
                </div>
                <div className="text-center mt-4">
                  <button
                    onClick={() => handleDetailClick(user.id)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
