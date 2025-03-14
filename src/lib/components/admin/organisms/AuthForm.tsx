"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Button from "@/lib/components/admin/molecules/Button";
import { Input } from "@/lib/components/admin/molecules/Input";
import InputError from "@/lib/components/admin/molecules/InputError";
import Card from "@/lib/components/admin/organisms/Card";

interface AuthFormProps {
  type: "login" | "signup";
}

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const [error, setError] = useState("");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<{ email: string; password: string }>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    setError("");
    setIsSubmitting(true);

    const res = await fetch(`/api/auth/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      const errorMessage = await res.text();
      setError(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card
        header={type === "login" ? "Login" : "Sign Up"}
        className="w-full max-w-[500px] sm:max-w-[400px] md:w-[500px]"
      >
        <form
          className="grid grid-cols-1 gap-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          {error && <p className="text-red-500">{error}</p>}

          <Input
            type="email"
            label="Email"
            {...register("email", {
              required: "Email ist erforderlich",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Ungültige Email-Adresse",
              },
            })}
          />
          <InputError errors={errors} name="email" />

          <Input
            type="password"
            label="Passwort"
            {...register("password", {
              required: "Passwort ist erforderlich",
              minLength: {
                value: 6,
                message: "Mindestens 6 Zeichen erforderlich",
              },
            })}
          />
          <InputError errors={errors} name="password" />

          <Button type="submit" isDisabled={!isValid || isSubmitting}>
            {type === "login" ? "Login" : "Registrieren"}
          </Button>
        </form>

        <p className="mt-4 text-sm">
          {type === "login" ? (
            <>
              Noch kein Konto?{" "}
              <a href="/auth/signup" className="text-blue-600">
                Registrieren
              </a>
            </>
          ) : (
            <>
              Bereits ein Konto?{" "}
              <a href="/auth/login" className="text-blue-600">
                Login
              </a>
            </>
          )}
        </p>
      </Card>
    </div>
  );
};

export default AuthForm;
