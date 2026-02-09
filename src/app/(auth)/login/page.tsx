import LoginForm from "@/components/auth/login-form";

export default function Login() {
  return (
    <div className="min-h-svh w-full flex justify-center items-center p-4">
      <div className="max-w-sm w-full mx-auto">
        <LoginForm />
      </div>
    </div>
  );
}
