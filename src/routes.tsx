// router.js
import { createBrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UserProfilePage from './pages/UserProfilePage';
import Login from './pages/Login';
import Layout from './pages/Layout';
import Register from './pages/Register';
import CreatePost from './pages/CreatePost';
import Discover from './pages/Discover';
import ProfileDetail from './pages/ProfileDetail';
import Messages from './pages/Messages';
import ChatSpace from './components/ChatSpace/ChatSpace';
import EditProfile from './pages/EditProfile';
import ShowPost from './pages/ShowPost';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: '/profile', element: <UserProfilePage /> },
      { path: '/edit-profile', element: <EditProfile /> },
      { path: '/post/:id', element: <ShowPost /> },
      { path: '/newpost', element: <CreatePost /> },
      {
        path: '/messages/',
        element: <Messages />,
        children: [
          { path: '', element: <ChatSpace /> },
          { path: ':id', element: <ChatSpace /> },
        ],
      },
      { path: '/discover', element: <Discover /> },
      { path: '/user/:id', element: <ProfileDetail /> },
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
]);

export default router;
