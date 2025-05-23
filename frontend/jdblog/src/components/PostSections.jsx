
import dateFormat from "dateformat";
import { useContext } from "react";
import { NavigationContext } from "../context/NavigationProvider";

function correctTime(datetime) {
  return dateFormat(new Date(
    new Date(datetime).toString().slice(0, 25) +
    " UTC",
  ), "d mmmm, yyyy")
}
function PostSection({ title, posts }) {
  const { nav } = useContext(NavigationContext);
  return (
    <div>
      <div className="xl:px-0 font-extrabold text-4xl line-clamp-1">
        {title}
      </div>
      <hr className="h-px my-2 border-2 border-slate-400/50 border-dashed"/>
      <div className="flex flex-col gap-0.0 md:gap-0 ">
        {posts.map((post) => (
          <div
            key={`post-${post.id}`}
            onClick={() => {
              nav(`/blog/${post.id}`);
            }}
            className="xl:flex-nowrap flex flex-col-reverse md:flex-row my-2 text-pretty text-xl cursor-pointer"
          >
            {post.title}
            <div className="flex-auto" />
            <div className="text-xs md:text-lg ">
              {correctTime(post.created_date)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default PostSection;
