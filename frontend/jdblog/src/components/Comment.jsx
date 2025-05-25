import TimeAgo from "react-timeago";

function splitmix32(a) {
  return function() {
    a |= 0;
    a = (a + 0x9e3779b9) | 0;
    let t = a ^ (a >>> 16);
    t = Math.imul(t, 0x21f0aaad);
    t = t ^ (t >>> 15);
    t = Math.imul(t, 0x735a2d97);
    return ((t = t ^ (t >>> 15)) >>> 0) / 4294967296;
  };
}
function correctTime(datetime) {
  return new Date(
    new Date(datetime).toString().slice(0, 25) + " UTC",
  ).toString();
}
function Comment({ comment }) {
  const color = parseInt(splitmix32(comment.owner.id)() * 360);
  return (
    <>
      <article className="p-4 text-base rounded-lg bg-stone-50 my-2 dark:bg-stone-950">
        <div className="flex items-center">
          <div className="items-center mr-3 text-sm text-stone-900 dark:text-stone-50 font-semibold flex flex-row">
            <div className="relative">
              <div className="w-8 h-8 rounded-full top-0 left-0 mr-4 ">
                <img
                  className="w-8 h-8 rounded-full object-cover absolute"
                  src={comment.owner.profile.photo}
                  onError={(ev) => {
                    ev.target.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==";
                  }}
                  alt={comment.owner.profile.photo}
                />
                <div
                  style={{ backgroundColor: `hsl(${color}, 50%, 50%)` }}
                  className="w-8 h-8 rounded-full items-center justify-center flex flex-row "
                >
                  {`${comment.owner.profile.firstName.charAt(0)}${comment.owner.profile.lastName.charAt(0)}`}
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              {`${comment.owner.profile.firstName} ${comment.owner.profile.lastName}`}

              <div className="text-xs text-stone-400 dark:text-stone-600 font-sans">
                <time pubdate="" title={comment.created_date}>
                  <TimeAgo
                    live={true}
                    date={correctTime(comment.created_date)}
                  />
                </time>
              </div>
            </div>
          </div>
        </div>

        <p className="text-stone-500 dark:text-stone-400 my-2">
          {comment.text}
        </p>
      </article>
    </>
  );
}
export default Comment;
