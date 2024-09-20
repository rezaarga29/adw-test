import reducer, {
  setUser,
  setUsers,
  setUserDetail,
  addUser,
  updateUserInState,
  logoutUser,
} from "../../store/userSlice";

describe("userSlice reducer", () => {
  const initialState = {
    value: 0,
    user: null,
    users: [],
    userDetail: null,
  };

  it("should handle setUser", () => {
    const user = { id: 1, username: "testuser" };
    const action = setUser(user);
    const state = reducer(initialState, action);
    expect(state.user).toEqual(user);
  });

  it("should handle setUsers", () => {
    const users = [
      { id: 1, username: "user1" },
      { id: 2, username: "user2" },
    ];
    const action = setUsers(users);
    const state = reducer(initialState, action);
    expect(state.users).toEqual(users);
  });

  it("should handle setUserDetail", () => {
    const userDetail = { id: 1, username: "user1", detail: "detail info" };
    const action = setUserDetail(userDetail);
    const state = reducer(initialState, action);
    expect(state.userDetail).toEqual(userDetail);
  });

  it("should handle addUser", () => {
    const newUser = { id: 3, username: "newuser" };
    const action = addUser(newUser);
    const state = reducer(initialState, action);
    expect(state.users).toContain(newUser);
  });

  it("should handle updateUserInState", () => {
    const preloadedState = {
      ...initialState,
      users: [
        { id: 1, username: "user1" },
        { id: 2, username: "user2" },
      ],
    };
    const updatedUser = { id: 1, username: "updatedUser" };
    const action = updateUserInState(updatedUser);
    const state = reducer(preloadedState, action);
    expect(state.users[0].username).toBe("updatedUser");
  });

  it("should handle logoutUser", () => {
    const preloadedState = {
      ...initialState,
      user: { id: 1, username: "user1" },
    };
    const action = logoutUser();
    const state = reducer(preloadedState, action);
    expect(state.user).toBe(null);
  });
});
