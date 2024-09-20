import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetail } from "../store/userSlice";
import { useParams } from "react-router-dom";

const UserDetailComponent = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const userDetail = useSelector((state) => state.user.userDetail);

  useEffect(() => {
    dispatch(fetchUserDetail(id));
  }, [dispatch, id]);

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4">
        {userDetail ? (
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
            <img
              src={userDetail.image}
              alt={userDetail.firstName}
              className="w-20 h-20 rounded-full mx-auto mb-4"
            />
            <h2 className="text-xl font-semibold text-center text-gray-800">
              {userDetail.firstName} {userDetail.lastName}
            </h2>
            <p className="text-center text-gray-500">@{userDetail.username}</p>
            <p className="text-center text-gray-500">{userDetail.email}</p>
            <p className="text-center text-gray-500">
              Gender: {userDetail.gender}
            </p>
            <p className="text-center text-gray-500">Age: {userDetail.age}</p>
          </div>
        ) : (
          <p className="text-center text-gray-500">Loading user details...</p>
        )}
      </div>
    </div>
  );
};

export default UserDetailComponent;
