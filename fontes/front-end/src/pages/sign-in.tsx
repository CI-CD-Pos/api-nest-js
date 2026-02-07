import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { NavLink, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { sigInSchema, type SignInSchema } from "../schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosed } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { login } from "../api/user/login";
import { toast } from "sonner";

export function SignIn() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SignInSchema>({
    resolver: zodResolver(sigInSchema),
    defaultValues: {
      email: location.state?.email || "",
      password: "",
    },
  });

  const { mutateAsync: loginMutate } = useMutation({
    mutationFn: login,
    onSuccess: ({ token }) => {
      localStorage.setItem("token", token);
      toast.success("Login realizado com sucesso!");
      navigate("/me");
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });
  async function onSubmit(data: SignInSchema) {
    await loginMutate(data);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-4"
    >
      <Input
        legend="E-mail"
        type="email"
        placeholder="seu@email.com"
        error={errors.email?.message}
        {...register("email")}
      />
      <div className="relative">
        <Input
          legend="Senha"
          type={isPasswordVisible ? "text" : "password"}
          placeholder="******"
          error={errors.password?.message}
          {...register("password")}
        />
        <button
          type="button"
          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          className="absolute right-4 bottom-3 cursor-pointer text-gray-200"
        >
          {isPasswordVisible ? (
            <Eye className="size-5 text-green-100" />
          ) : (
            <EyeClosed className="size-5 text-green-100" />
          )}
        </button>
      </div>
      <Button type="submit">Entrar</Button>

      <NavLink
        to={"/sign-up"}
        className="mt-7 mb-4 text-center text-sm font-semibold text-gray-100 transition ease-initial hover:text-green-800"
      >
        Criar conta
      </NavLink>
    </form>
  );
}
