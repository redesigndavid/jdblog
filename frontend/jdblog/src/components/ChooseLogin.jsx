import { FaGoogle, FaGithub } from "react-icons/fa";

export function LoginButton({ icon, name }) {
  return (
    <a
      href={`${import.meta.env.VITE_API_URL}/login/${name}?redirect=${window.location.href}`}
    >
      <div className="bg-orange-100 w-full px-6 py-4 my-4 rounded-xl flex flex-row gap-4">
        {icon}
        <div className="flex flex-col">
          <div className="flex-auto" />
          <div className="align-middle">
            Sign in with {name.charAt(0).toUpperCase() + name.slice(1)}
          </div>
          <div className="flex-auto" />
        </div>
      </div>
    </a>
  );
}

function ChooseLogin(props) {
  return (
    <>
      <div
        {...props}
        className="bg-stone-500/80 fixed top-0 left-0 w-dvw h-dvh flex items-center justify-center "
      >
        <div className="text-black bg-stone-50 rounded-2xl w-xl h-xl p-8">
          <div className="text-3xl font-special">Sign in to comment</div>
          <LoginButton icon={<FaGoogle size={28} />} name={"google"} />
          <LoginButton icon={<FaGithub size={28} />} name={"github"} />
        </div>
      </div>
    </>
  );
}
export default ChooseLogin;
