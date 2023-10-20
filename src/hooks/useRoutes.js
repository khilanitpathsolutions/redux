import { lazy, useMemo } from 'react';
import Profile from '../container/profile';
import Checkout from '../container/checkout';
import OrderSuccess from '../container/oderSuccess';
import Orders from '../container/orders';
import Counter from '../container/classComponent';
const LoginPage = lazy(() => import ('../container/login'));
const Home = lazy(() => import ('../container/home'));
const Cart = lazy(() => import ('../container/cart'));
const WishList = lazy(() => import ('../container/wishList'));
const RegistrationPage = lazy(() => import ('../container/registration'));
const Product = lazy(() => import ('../container/product'));
const AddProduct = lazy(() => import ('../container/addProduct'));

const useRoutes = () => {
  const routes = useMemo(()=> [
    {
      id: 'login',
      path: '/login',
      element: <LoginPage />,
      isAuth: true
    },
    {
      id: 'registration',
      path: '/register',
      element: <RegistrationPage />,
      isAuth: true
    },
    {
      id: 'cart',
      path: '/cart',
      element: <Cart />,
      isPrivate: true,
      userRole: 'user'
    },
    {
      id: 'checkout',
      path: '/checkout',
      element: <Checkout />,
      isPrivate: true,
      userRole: 'user'
    },
    {
      id: 'orderSuccess',
      path: '/orderConfirm',
      element: <OrderSuccess />,
      isPrivate: true,
      userRole: 'user'
    },
    {
      id: 'wishlist',
      path: '/wishlist',
      element: <WishList />,
      isPrivate: true,
      userRole: 'user'
    },
    {
      id: 'profile',
      path: '/profile',
      element: <Profile />,
      isPrivate: true,
      userRole: 'user'
    },
    {
      id: 'addProduct',
      path: '/addproduct',
      element: <AddProduct />,
      isPrivate: true,
      userRole: 'admin',
      isAdminOnly: true,
    },
    {
      id: 'orders',
      path: '/orders',
      element: <Orders />,
      isPrivate: true,
      userRole: 'admin',
      isAdminOnly: true,
    },
    {
      id: 'product',
      path: '/product/:item_id',
      element: <Product />,
      isPublic: true
    },
    {
      id: 'home',
      path: '/',
      element: <Home />,
      isPublic: true
    },
    {
      id: 'class',
      path: '/class',
      element: <Counter />,
      isPublic: true
    }
  ], [])

 const privateRoutes = useMemo(()=>{
  return isPrivate => routes.filter(data=> data.isPrivate === isPrivate)
 },[routes])

 const publicRoutes = useMemo(()=>{
 return isPublic => routes.filter(data=> data.isPublic === isPublic)
 },[routes])

 const authRoutes = useMemo(()=>{
 return isAuth => routes.filter(data => data.isAuth === isAuth)
 },[routes])

 return { routes,privateRoutes,publicRoutes,authRoutes };
};

export default useRoutes;
