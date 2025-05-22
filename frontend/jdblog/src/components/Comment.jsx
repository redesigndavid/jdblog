import TimeAgo from "react-timeago";

function Comment({ comment }) {
  return (
    <>
      <article className="p-4 text-base rounded-lg bg-stone-50 my-2 dark:bg-stone-950">
        <div className="flex items-center">
          <div className="inline-flex items-center mr-3 text-sm text-stone-900 dark:text-stone-50 font-semibold flex flex-row">
            <img
              className="mr-4 w-8 h-8 rounded-full object-cover"
              src={comment.owner.profile.photo}
            />
            <div className="flex flex-col">
              {comment.owner.profile.firstName}

              <div className="text-xs text-stone-400 dark:text-stone-600 font-sans">
                <time pubdate="" title={comment.created_date}>
                  <TimeAgo
                    live={true}
                    date={new Date(
                      new Date(comment.created_date).toString().slice(0, 25) +
                      " UTC",
                    ).toString()}
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
