import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import React, { FormEvent, useRef } from 'react'
import { getCsrfToken } from './Login';
import { useNavigate } from 'react-router-dom';

interface NewPost {
  file: File;
  caption: string;
}
const CreatePost = () => {
  const file = useRef<HTMLInputElement>(null);
  const caption = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const {mutate, isLoading} = useMutation({
    mutationFn: async (post: NewPost) => {
      await axios.get('http://localhost:8000/sanctum/csrf-cookie', {withCredentials: true});
      const csrfToken = getCsrfToken();
      const data = new FormData();
      data.append('file_url', post.file)
      data.append('caption', post.caption)

      await axios.post('http://localhost:8000/api/v1/posts', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
          'XSRF-TOKEN': csrfToken,
        },
        withCredentials: true,
        withXSRFToken: true,
      })
    },

    onSuccess: () => {
      navigate('/')
    }
  })
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (caption.current?.value && file.current?.files) {
      mutate({
        caption: caption.current?.value,
        file: file.current.files[0]
      })
      
    } else {
      console.log('erororo')
    }
  }
  return (
    <div className="center-form-div">
        <form onSubmit={(e) => handleSubmit(e)} encType="multipart/form-data">
            <input ref={file} type="file" className="file-field" name="file_url" id="file"/>
            <input ref={caption} className="text-field" type="text" placeholder="Caption" name="caption"/>
            <button type="submit">{isLoading ? 'Posting...' : 'Post'}</button>
        </form>
    </div>
  )
}

export default CreatePost