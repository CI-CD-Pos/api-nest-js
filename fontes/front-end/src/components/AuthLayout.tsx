import { Outlet } from "react-router";
import logo from "../assets/icons/logo.svg";

export function AuthLayout() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-gray-400 text-gray-100">
      <main className="flex flex-col items-center rounded-lg bg-gray-500 p-8 sm:min-w-md md:min-w-lg">
        <img className="my-8" src={logo} alt="Logo Refund" />
        <Outlet />
      </main>
    </div>
  );
}
