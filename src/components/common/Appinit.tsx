import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { useGetProfileQuery } from "@/store/api/authApi";
import { updateUser } from "@/store/slices/authSlice";

export default function AppInit() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, token } = useAppSelector((s) => s.auth);

  const { data, isSuccess } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated || !token,
  });

  useEffect(() => {
    if (isSuccess && data?.data) {
      dispatch(updateUser(data.data));
    }
  }, [isSuccess, data]);

  // Never logout here — axios interceptor handles 401 and redirects to /login
  return null;
}