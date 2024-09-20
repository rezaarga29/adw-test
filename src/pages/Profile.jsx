import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../store/userSlice";

export default function Profile() {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        dispatch(setUser(JSON.parse(storedUser)));
      }
    }
  }, [dispatch, user]);

  const handleEditProfile = () => {
    if (user && user.id) {
      navigate(`/edit-profile/${user.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-8">
          User Profile
        </h1>

        {user ? (
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
            <div className="flex justify-center">
              <img
                src={user.image}
                alt="Profile"
                className="w-24 h-24 rounded-full mb-4"
              />
            </div>
            <h2 className="text-xl font-semibold text-center text-gray-800">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-center text-gray-500">@{user.username}</p>
            <p className="text-center text-gray-500">{user.email}</p>
            <p className="text-center text-gray-500">Gender: {user.gender}</p>

            {/* Tombol Edit */}
            <div className="text-center mt-6">
              <button
                onClick={handleEditProfile}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg"
              >
                Edit Profile
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No user data available. Please log in.
          </p>
        )}
      </div>
    </div>
  );
}
