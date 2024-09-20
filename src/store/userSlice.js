import { createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import axios from "axios";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    value: 0,
    user: null,
    users: [],
    userDetail: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setUserDetail: (state, action) => {
      state.userDetail = action.payload;
    },
    addUser: (state, action) => {
      state.users.push(action.payload);
    },
    updateUserInState: (state, action) => {
      const updatedUser = action.payload;
      const index = state.users.findIndex((user) => user.id === updatedUser.id);
      if (index !== -1) {
        state.users[index] = updatedUser;
      }
    },
    logoutUser: (state) => {
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    },
  },
});

export const {
  setUser,
  setUsers,
  setUserDetail,
  addUser,
  updateUserInState,
  logoutUser,
} = userSlice.actions;

export const loginUser = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post(
      `https://dummyjson.com/auth/login`,
      credentials
    );
    dispatch(setUser(data));

    localStorage.setItem("token", data.token);
    localStorage.setItem("refreshToken", data.refreshToken);

    localStorage.setItem("user", JSON.stringify(data));

    Swal.fire({
      title: "Login Successful!",
      text: `Welcome ${data.username}`,
      icon: "success",
      confirmButtonText: "Ok",
    });
  } catch (error) {
    Swal.fire({
      title: "Login Failed!",
      text: error.response?.data?.message || "An error occurred during login",
      icon: "error",
      confirmButtonText: "Ok",
    });
  }
};

export const fetchUsers =
  (sortBy = "firstName", order = "asc") =>
  async (dispatch) => {
    try {
      const { data } = await axios.get(
        `https://dummyjson.com/users?sortBy=${sortBy}&order=${order}`
      );
      dispatch(setUsers(data.users));
    } catch (error) {
      // console.error("Error fetching users:", error);
      Swal.fire({
        title: "Error!",
        text:
          error.response?.data?.message ||
          "An error occurred while fetching users",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

export const fetchUserDetail = (userId) => async (dispatch) => {
  try {
    const { data } = await axios.get(`https://dummyjson.com/users/${userId}`);
    dispatch(setUserDetail(data));
  } catch (error) {
    // console.error("Error fetching user detail:", error);
    Swal.fire({
      title: "Error!",
      text:
        error.response?.data?.message ||
        "An error occurred while fetching user details",
      icon: "error",
      confirmButtonText: "Ok",
    });
  }
};

export const searchUsers = (query) => async (dispatch) => {
  try {
    const { data } = await axios.get(
      `https://dummyjson.com/users/search?q=${query}`
    );
    dispatch(setUsers(data.users));
  } catch (error) {
    // console.error("Error searching users:", error);
    Swal.fire({
      title: "Error!",
      text:
        error.response?.data?.message ||
        "An error occurred while searching users",
      icon: "error",
      confirmButtonText: "Ok",
    });
  }
};

export const createUser = (newUser) => async (dispatch) => {
  try {
    const { data } = await axios.post(
      `https://dummyjson.com/users/add`,
      newUser
    );
    dispatch(addUser(data));
    // console.log("User added:", data);
    Swal.fire({
      title: "User Added Successfully!",
      text: `User ${data.firstName} ${data.lastName} has been added.`,
      icon: "success",
      confirmButtonText: "Ok",
    });
  } catch (error) {
    // console.error("Error adding user:", error);
    Swal.fire({
      title: "Error!",
      text:
        error.response?.data?.message || "An error occurred while adding user",
      icon: "error",
      confirmButtonText: "Ok",
    });
  }
};

export const updateUser = (userId, updatedUser) => async (dispatch) => {
  try {
    const { data } = await axios.put(
      `https://dummyjson.com/users/${userId}`,
      updatedUser
    );
    dispatch(updateUserInState(data));
    // console.log("Updated user:", data);
    Swal.fire({
      title: "User Updated Successfully!",
      text: `User ${data.firstName} ${data.lastName} has been updated.`,
      icon: "success",
      confirmButtonText: "Ok",
    });
  } catch (error) {
    // console.error("Error updating user:", error);
    Swal.fire({
      title: "Error!",
      text:
        error.response?.data?.message ||
        "An error occurred while updating user",
      icon: "error",
      confirmButtonText: "Ok",
    });
  }
};

export default userSlice.reducer;
