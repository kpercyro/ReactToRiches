import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Landing from './components/Landing';
import BlogList from './components/Blog/BlogList.js';
import WriteBlog from './components/Blog/WriteBlog.js';
import Budget from './components/Budget/BudgetLand.js';
import Goals from './components/Goals/GoalsLand.js';
import AddGoals from './components/Goals/AddGoals.js';
import Limits from './components/Budget/Limits.js';
import CategoryForm from './components/Budget/CategoryForm.js';
import Categories from './components/Budget/Categories.js';
import Expenses from './components/Budget/Editor.js';
import ViewTransactions from './components/Budget/ViewTransactions.js';
import ViewBlog from './components/Blog/ViewBlog.js';
import ViewOwnBlogs from './components/Blog/ViewOwnBlogs.js';
import EditBlog from './components/Blog/EditBlog.js';
import Watchlist from './components/Watchlist/watchlist.js';
import Stocks from './components/Stocks/livestocks.js';
import Community from './components/Community/community.js';
import Messaging from './components/Messaging/messaging.js';
import SignUp from './components/Account/SignUp.js';
import NotificationMenu from './components/Notifications/NotificationMenu.js';
import Videos from './components/Videos/VideoList.js';
import PostVideo from './components/Videos/PostVideo.js';
import CreditScore from './components/CreditScore/creditScore.js';
import FoodServices from './components/UWaterloo/FoodServices.js';
import ViewOutlet from './components/UWaterloo/ViewOutlet.js';
import ViewFranchise from './components/UWaterloo/ViewFranchise.js';
import ImportantDates from './components/UWaterloo/ImportantDates.js';
import store from './components/Account/store.js';
import {Provider} from 'react-redux';
import Firebase, {FirebaseContext} from './components/Firebase';
import * as serviceWorker from './serviceWorker';

// Import BrowserRouter, Routes, and Route from react-router-dom
import {BrowserRouter, Routes, Route} from 'react-router-dom';

ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/blogList" element={<BlogList />} />
          <Route path="/editBlog/*" element={<EditBlog />} />
          <Route path="/writeBlog" element={<WriteBlog />} />
          <Route path="/viewOwnBlogs" element={<ViewOwnBlogs />} />
          <Route path="/viewBlog/*" element={<ViewBlog />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/categoryForm" element={<CategoryForm />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/limits" element={<Limits />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/viewTransactions" element={<ViewTransactions />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/addGoals" element={<AddGoals />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/livestocks" element={<Stocks />} />
          <Route path="/community" element={<Community />} />
          <Route path="/messaging" element={<Messaging />} />
          <Route path="/notificationMenu" element={<NotificationMenu />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/postVideo" element={<PostVideo />} />
          <Route path="creditScore" element={<CreditScore />} />
          <Route path="foodServices" element={<FoodServices />} />
          <Route path="/viewOutlet/*" element={<ViewOutlet />} />
          <Route path="/viewFranchise/*" element={<ViewFranchise />} />
          <Route path="/importantDates" element={<ImportantDates />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </FirebaseContext.Provider>,
  document.getElementById('root'),
);

serviceWorker.unregister();
