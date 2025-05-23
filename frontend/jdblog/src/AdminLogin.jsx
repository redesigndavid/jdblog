import { FaGoogle, FaGithub } from "react-icons/fa";
import { LoginButton } from "./components/ChooseLogin";

function AdminLogin() {
  return (
    <>
      <div className="min-h-[70dvh] flex flex-col justify-center gap-4">
        <div className="text-black bg-stone-50 rounded-2xl w-xl h-xl p-8">
          <div className="text-3xl font-special">Sign in</div>
          <LoginButton icon={<FaGoogle size={28} />} name={"google"} />
          <LoginButton icon={<FaGithub size={28} />} name={"github"} />
        </div>
      </div>
    </>
  );
}
export default AdminLogin;
