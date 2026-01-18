import { CommentItem } from './CommentItem';

const DUMMY_COMMENTS = Array.from({ length: 10 }).map((_, i) => ({
  id: `c-${i}`,
  content:
    i % 3 === 0
      ? "This is a great point! I've been thinking about this for a while now."
      : "Exactly! I couldn't agree more with the user above.",
  createdAt: new Date(Date.now() - i * 1000 * 60 * 60), // Each one an hour older
  user: {
    name: i % 2 === 0 ? 'Sarah Jenkins' : 'Mike Ross',
    username: i % 2 === 0 ? 'sjenkins' : 'mross',
    image: null,
  },
  likesCount: Math.floor(Math.random() * 10),
  isLiked: i % 4 === 0,
}));

export function CommentList() {
  return (
    <div className='w-full max-w-140 mx-auto'>
      {/* pb-24 gives space for fixed bar */}
      <h3 className='font-bold text-lg mb-4'>Comments</h3>
      <div className='flex flex-col'>
        {DUMMY_COMMENTS.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
