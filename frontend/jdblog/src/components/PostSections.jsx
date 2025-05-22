import Moment from "moment";
import { useNavigate } from "react-router";
function PostSection({ title, posts }) {
  const navigate = useNavigate();
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
              navigate(`/blog/${post.id}`);
            }}
            className="xl:flex-nowrap flex flex-col-reverse md:flex-row my-2 text-pretty text-xl cursor-pointer"
          >
            {post.title}
            <div className="flex-auto" />
            <div className="text-xs md:text-lg ">
              {Moment(post.created_date.slice(0, 23)).format("d MMMM, YYYY")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default PostSection;
