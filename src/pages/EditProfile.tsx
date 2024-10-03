import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { FormEvent, useEffect, useRef } from 'react';
import { getCsrfToken } from './Login';
import { useNavigate } from 'react-router-dom';
import LoadingBar from '../components/LoadingBar';
import useUserStore from '../services/userStore';

interface UserSubmit {
  name: string;
  email: string;
  userName: string;
}

const EditProfile = () => {
  const navigate = useNavigate();
  const {user} = useUserStore();
  const name = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const userName = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const confirmPassword = useRef<HTMLInputElement>(null);
  const file = useRef<HTMLInputElement>(null);
console.log(user)
  useEffect(() => {
    name.current.value = user.name;
    email.current.value = user.email;
    userName.current.value = user.userName;
  })

  const { mutate, isLoading, error } = useMutation<UserSubmit, Error, UserSubmit> ({
    mutationFn: async (userSubmit: UserSubmitSubmit) => {
      await axios.get("http://localhost:8000/sanctum/csrf-cookie", { withCredentials: true });
      const csrfToken = getCsrfToken();

      const formData = new FormData();
      formData.append('name', userSubmit.name);
      formData.append('email', userSubmit.email);
      formData.append('user_name', userSubmit.userName);

      await axios.post<UserSubmit>(`http://localhost:8000/api/v1/users/${user.id}`, formData, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
          'X-XSRF-TOKEN': csrfToken,
        },
        withCredentials: true,
        withXSRFToken: true,
      }).then(res => res.data);
      return user
    },
    onSuccess: () => {
      navigate('/profile')
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name.current?.value && email.current?.value && userName.current?.value ) {
      mutate({
        name: name.current.value,
        email: email.current.value,
        userName: userName.current.value,
      });
    }
  };

  return (
    <div className="center-form-div edit-profile">
      {isLoading && <LoadingBar />}
      <form onSubmit={handleSubmit}>
        <h1>Edit Your Profile</h1>
        {error && error.response.data.message}
        <input ref={name} className="text-field" type="text" placeholder="Name" name="name" />
        <input ref={email} className="text-field" type="email" placeholder="Email" name="email" />
        <input ref={userName} className="text-field" type="text" placeholder="User Name" name="user_name" />
        <button type="submit">{ isLoading ? 'Updating...' : 'Update' }</button>
      </form>
    </div>
  );
};

export default EditProfile;
