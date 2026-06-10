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
      // Profile returns { data: { user: {...} } } not { data: {...} }
      const user = (data.data as any).user ?? data.data;
      if (user?.role) {
        dispatch(updateUser(user));
      }
    }
  }, [isSuccess, data]);

  return null;
}
