import ThreadCard from '@/components/cards/ThreadCard';
import { fetchPosts } from '@/lib/actions/thread.actions';
import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';

export default async function Home() {
   const { posts } = await fetchPosts();
   const user = await currentUser();

   return (
      <>
         <h1 className='head-text text-left'>Home</h1>

         <section className='mt-9 flex flex-col gap-10'>
            {posts.length === 0 ? (
               <p className='no-result'>No Threads Found!</p>
            ) : (
               <>
                  {posts.map((post) => (
                     <ThreadCard
                        key={post._id}
                        id={post._id}
                        currentUserId={user?.id as string}
                        parentId={post.parentId}
                        content={post.text}
                        author={post.author}
                        community={post.community}
                        createdAt={post.createdAt}
                        comments={post.children}
                     />
                  ))}
               </>
            )}
         </section>
      </>
   );
}
