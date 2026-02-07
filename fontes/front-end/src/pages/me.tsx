import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api/user/get-me";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { Button } from "../components/Button";

export function Me() {
  const navigate = useNavigate();

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
  });

  useEffect(() => {
    if (isError) {
      localStorage.removeItem("token");
      navigate("/sign-in");
    }
  }, [isError, navigate]);

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/sign-in");
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-400">
        <p className="text-gray-100">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-gray-400 text-gray-100">
      <main className="flex flex-col items-center gap-6 rounded-lg bg-gray-500 p-8 sm:min-w-md md:min-w-lg">
        <h1 className="text-2xl font-bold text-green-100">Meus Dados</h1>

        <div className="flex w-full flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-gray-200">ID</span>
            <span className="text-lg font-medium">{user?.id}</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm text-gray-200">Nome</span>
            <span className="text-lg font-medium">{user?.name}</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm text-gray-200">E-mail</span>
            <span className="text-lg font-medium">{user?.email}</span>
          </div>
        </div>

        <Button type="button" onClick={handleLogout}>
          Sair
        </Button>
      </main>
    </div>
  );
}
