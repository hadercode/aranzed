import { Route } from "react-router-dom";
import { PublicRoute } from "@/shared/components/PublicRoute";
import {
  LoginPage as Login,
  RegisterPage as Register,
  RecoverPasswordPage as RecoverPassword,
  ResetPasswordPage as ResetPassword,
} from "@/features/auth";

export const authRoutes = (
  <Route element={<PublicRoute />}>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/recover-password" element={<RecoverPassword />} />
    <Route path="/reset-password" element={<ResetPassword />} />
  </Route>
);

export default authRoutes;
