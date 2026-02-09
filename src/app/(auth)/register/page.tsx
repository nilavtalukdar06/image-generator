import RegisterForm from "@/components/auth/register-form";
import { Dalle, OpenAI } from "@lobehub/icons";

export default function Register() {
  return (
    <div className="min-h-svh w-full flex flex-col gap-4 justify-center items-center p-4 bg-sidebar">
      <div className="max-w-sm mx-auto px-5 w-full flex justify-center items-center gap-x-2">
        <OpenAI size={25} />
        <Dalle.Text size={20} />
      </div>
      <div className="max-w-sm w-full mx-auto">
        <RegisterForm />
      </div>
    </div>
  );
}
