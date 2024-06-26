import { useDispatch } from "react-redux";
import axios from "../api/axios";
import { setCredentials } from "../redux/authSlice";

const useRefreshToken = () => {
  const dispatch = useDispatch();

  const refresh = async () => {
    const response = await axios.get("/auth/tpv/refresh", {
      withCredentials: true,
    });

    dispatch(setCredentials({ ...response.data }));
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
