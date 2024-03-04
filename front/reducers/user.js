import { createSlice } from "@reduxjs/toolkit";
import { notification } from 'antd';
const openNotification = (msg) => {
  notification.error({
      message: `에러`,
      description: msg,
      placement: 'top',
      duration: 2.5
    });
};


export const userSlice = createSlice({
    name: "user",
    initialState : {
      loginLoading:false,
      logoutLoading:false,
      signupLoading:false,
      signUpDone:false,
      followLoading:false,
      isLogin: false,
      updateNicknameLoading: false,
      user: null,
      imagePaths: [],
    },

    reducers: {
      loginRequest: (state) => {
        state.loginLoading = true;
      },
      loginSuccess : (state , action) => {
        state.isLogin = true;
        state.loginLoading = false;
        state.user = action.data;
      },
      loginFailure : (state , action) => {
        openNotification(action.error)
        state.isLogin = false;
        state.loginLoading = false;
      },

      signupRequest: (state) => {
        state.signupLoading = true;
        state.signUpDone = false;
      },
      signupSuccess : (state , action) => {
        state.signupLoading = false;
        state.signUpDone = true;
      },
      signupFailure : (state , action) => {
        openNotification(action.error)
        state.signupLoading = false;
        state.signUpDone = false;
      },


      logoutRequest : (state) => {
          state.logoutLoading = true;
      },
      logoutSuccess : (state) => {
        state.user = null
        state.isLogin = false;
        state.logoutLoading = false;
      },
      logoutFailure : (state) => {
        state.user = initialState.user;
        state.logoutLoading = false;
      },

      loadUserRequest: (state) => {
        state.isLogin = false;
      },
      loadUserSuccess: (state,action) => {
        if(action.data) {
          state.user = action.data
          state.isLogin = true;
        }
      },
      loadUserFailure: (state) => {
        state.isLogin = false;
      },

      addPostToMe: (state,action) => {
        state.user.Posts.push({id:action.data.id})
      },
      removePostToMe: (state,action) => {
        state.user.Posts = state.user.Posts.filter(v => v.id !== action.data.PostId)
      },


      followRequest: (state) => {
        state.followLoading = true;
      },
      followSuccess: (state,action) => {
        if(action.data.type === 'follow') {
          state.user.Followings.push({id:action.data.UserId})
        } else if(action.data.type === 'unFollow') {
          state.user.Followings = state.user.Followings.filter(v => v.id !== action.data.UserId)
        }
        
        state.followLoading = false;
      },
      followFailure: (state) => {
        state.followLoading = false;
      },


      updateNicknameRequest: (state) => {
        state.updateNicknameLoading = true;
      },
      updateNicknameSuccess: (state,action) => {
        state.user.nickname = action.data.nickname;
        state.updateNicknameLoading = false;
      },
      updateNicknameFailure: (state , action) => {
        state.updateNicknameLoading = false;
        openNotification(action.error)
      },


      

    },
});

export const user = userSlice.reducer;
export const userAction = userSlice.actions;