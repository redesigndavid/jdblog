import { MdOutlineLogin, MdOutlineLogout } from "react-icons/md";
function LogOutButton(props) {
  const { logOut,isLoggedIn } = props;
  return (
    isLoggedIn && (
      <div onClick={logOut} className="py-4 cursor-pointer">
        <MdOutlineLogout size={28} />
      </div>
    )
  );
}
export default LogOutButton;
