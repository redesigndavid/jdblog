import { useNavigate } from "react-router";
function Tag({ tagname }) {
  const navigate = useNavigate();
  return (
    <>
      <div
        onClick={() => {
          navigate(`/tag/${tagname}`);
        }}
        className="flex flex-row text-black cursor-pointer"
      >
        <div className="bg-amber-200 line-clamp-1 rounded-full p-3 pr-4 flex flex-row ">
          <span className="text-emerald-400 p-0">#</span>
          <div className="">{tagname}</div>
        </div>
        <div className="flex-auto" />
      </div>
    </>
  );
}

export default Tag;
