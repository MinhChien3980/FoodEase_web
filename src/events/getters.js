import { store } from "@/store/store";
import { useSelector } from "react-redux";

export const getBranchId = () => {
  // return 7;
  const state = store.getState();
  return state.branch.id;
};

// export const getAuthToken = () => {
//   const authStoreData = useSelector((state) => state.authentication);
//   if (!authStoreData.isLogged) {
//     return false;
//   }
//   return authStoreData.accessToken;
// };

export const getUserData = () => {
  const authStoreData = store.getState().authentication;
  if (!authStoreData.isLogged) {
    return false;
  }
  const UserData = store.getState().userSettings.value;
  return UserData;
};

export const isLogged = () => {
  const state = store.getState().authentication;
  return state.isLogged;
};
