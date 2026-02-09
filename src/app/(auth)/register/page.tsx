import RegisterForm from "@/components/auth/register-form";

export default function Register() {
  return (
    <div className="min-h-svh w-full flex justify-center items-center p-4">
      <div className="max-w-sm w-full mx-auto">
        <RegisterForm />
      </div>
    </div>
  );
}
