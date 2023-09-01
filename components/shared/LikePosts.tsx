'use client';
import { likeThread } from '@/lib/actions/thread.actions';
import { fetchUser } from '@/lib/actions/user.actions';
import Image from 'next/image';
import { useState } from 'react';

type Props = {
   threadId: string;
   currentUserId: string;
};

const LikePosts = ({ threadId, currentUserId }: Props) => {
   const [likes, setLikes] = useState([]);

   async function likeClickHandler() {
      const likesData = await likeThread(threadId, currentUserId);
      setLikes(JSON.parse(likesData));
      console.log(JSON.parse(likesData));
   }

   return (
      <>
         {/* <button onClick={likeClickHandler} type='button'>
            <Image src='/assets/heart-filled.svg' alt='like' width={24} height={24} className='cursor-pointer object-contain' />
         </button> */}
         <button onClick={likeClickHandler} type='button'>
            <Image src='/assets/heart-gray.svg' alt='like' width={24} height={24} className='cursor-pointer object-contain' />
         </button>
      </>
   );
};

export default LikePosts;
