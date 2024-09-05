import { FormEvent, useRef } from 'react';
import styles from './posts.module.css'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { getCsrfToken } from '../../pages/Login';
import usePostComments from '../../hooks/usePostComments';
import { Post } from '../../hooks/usePosts';

interface CommentFormProps {
  post: Post;
}
const CommentForm = ({ post } : CommentFormProps) => {
  const commentRef = useRef<HTMLInputElement | null>(null);
  const postComment = usePostComments(post.id, () => {
    if (commentRef.current) {
      commentRef.current.value = '';
    }
  });
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (commentRef.current?.value) {
      postComment.mutate({
        commentBody: commentRef.current?.value
      })
    } else {
      console.log('the field is required')
    }
  } 
  return (
    <div className={styles.postCommentContainer}>
      <form action="" onSubmit={(e) => handleSubmit(e)}>
        <input ref={commentRef} type="text" placeholder='Write Your Comment Here...' />
        <button type='submit'>{ postComment.isLoading ? 'Posting...' : 'Post' }</button>
      </form>
    </div>
  )
}

export default CommentForm