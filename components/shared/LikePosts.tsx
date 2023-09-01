'use client';
import { likeThread } from '@/lib/actions/thread.actions';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

type Props = {
   threadId: string;
   currentUserId: string;
};

const LikePosts = ({ threadId, currentUserId }: Props) => {
   const pathname = usePathname();
   async function likeClickHandler() {
      await likeThread(threadId, currentUserId, pathname);
   }

   return (
      <button onClick={likeClickHandler} type='button'>
         <Image src='/assets/heart-gray.svg' alt='like' width={24} height={24} className='cursor-pointer object-contain' />
      </button>
   );
};

export default LikePosts;
