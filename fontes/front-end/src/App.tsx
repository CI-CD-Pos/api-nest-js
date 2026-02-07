import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./utils/react-query";
import { SignIn } from "./pages/sign-in";
import { Toaster } from "sonner";
import { SignUp } from "./pages/sign-up";
import { AuthLayout } from "./components/AuthLayout";
import { Me } from "./pages/me";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthLayout />}>
            <Route path="/" element={<Navigate to="/sign-in" replace />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
          </Route>
          <Route path="/me" element={<Me />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
