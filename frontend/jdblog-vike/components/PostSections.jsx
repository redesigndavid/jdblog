import dateFormat from "dateformat";

function correctTime(datetime) {
  return dateFormat(
    new Date(new Date(datetime).toString().slice(0, 25) + " UTC"),
    "d mmmm, yyyy",
  );
}
function PostSection({ title, posts }) {

  return (
    <div>
      <div className="xl:px-0 font-extrabold text-4xl line-clamp-1">
        {title}
      </div>
      <hr className="h-px my-2 border-2 border-slate-400/50 border-dashed" />
      <div className="flex flex-col gap-0.0 md:gap-0 ">
        {posts
          .sort((b, a) => {
            return Date.parse(a.created_date) - Date.parse(b.created_date);
          })
          .map((post) => (
            <a
              href={`/blog/${post.id}/${post.title.toLowerCase().replace(/\s+/g, "-")}`}
              key={`post-${post.id}`}
              className="xl:flex-nowrap flex flex-col-reverse md:flex-row my-2 text-pretty text-xl cursor-pointer"
            >
              <div className="flex flex-row">
                <div>{post.title}</div>
              </div>
              <div className="flex-auto" />
              <div className="text-xs md:text-lg ">
                {correctTime(post.created_date)}
              </div>
            </a>
          ))}
      </div>
    </div>
  );
}
export default PostSection;
