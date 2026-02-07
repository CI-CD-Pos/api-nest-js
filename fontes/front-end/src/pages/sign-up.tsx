import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signUpSchema, type SignUpSchema } from "../schemas/auth";

import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useMutation } from "@tanstack/react-query";
import { createUser } from "../api/user/create-user";
import { toast } from "sonner";

export function SignUp() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });
  const { mutateAsync: createUserMutate } = useMutation({
    mutationFn: createUser,
    onSuccess: (_, variables) => {
      toast.success("Usuário criado com sucesso!");
      navigate("/sign-in", { state: { email: variables.email } });
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });
  async function onSubmit(data: SignUpSchema) {
    await createUserMutate(data);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-4"
    >
      <Input
        legend="Nome"
        type="text"
        placeholder="Joe Doe"
        error={errors.name?.message}
        {...register("name")}
      />
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
        to={"/"}
        className="mt-7 mb-4 text-center text-sm font-semibold text-gray-100 transition ease-initial hover:text-green-800"
      >
        Entrar
      </NavLink>
    </form>
  );
}
