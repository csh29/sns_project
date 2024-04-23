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


export const notificationSlice = createSlice({
    name: "notification",
    initialState : {
      notisData:[]
    },
  
    reducers: {
      addNotificationRequest: (state) => {
      },
      addNotificationSuccess: (state,action) => {
      
      },
      addNotificationFailure: (state,action) => {
        openNotification(action.error)
      },


      receptionRequest:(state) => {

      },
      receptionSuccess: (state,action) => {
        state.notisData = action.data
      },
      receptionFailure: (state,action) => {
        openNotification(action.error)
      },

      logoutRequest: (state) => {

      },
      logoutSuccess: (state,action) => {
        state.notisData = [];
      },
      logoutFailure: (state,action) => {
        openNotification(action.error)
      },

      setNotisData: (state,action) => {
        state.notisData = action.payload;
      },

      receptionAllNotiRequest: (state) => {

      },
      receptionAllNotiSuccess: (state,action) => {
        state.notisData = [];
      },
      receptionAllNotiFailure: (state,action) => {
        openNotification(action.error)
      },
    },
  });
  
  export const noti = notificationSlice.reducer;
  export const notiAction = notificationSlice.actions;