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

export const postSlice = createSlice({
  name: "post",
  initialState : {
    mainPosts: [],
    imagePaths: [],
    saveFileList: [],
    postAdded: false,
    addCommentLoading:false,
    addPostLoading:false,
    updatePostLoading:false,
    loadPostsLoading:false,
    removeFileListLoading:false,
    searchHashTagLoading: false,
    hasMorePosts: true,
    addPostDone:false,
    addCommentDone:false,
  },

  reducers: {
    loadPostsRequest: (state) => {
      state.loadPostsLoading = true;
    },
    loadPostsSuccess: (state,action) => {
      if(action.data.payload) {
        state.mainPosts = state.mainPosts.concat(action.data.result);
        state.hasMorePosts = action.data.length === 10;
      } else {
        state.mainPosts = action.data.result;
      }
        state.loadPostsLoading = false;
        
    },
    loadPostsFailure: (state,action) => {
      state.loadPostsLoading = false;
      openNotification(action.error)
    },
    addCommentRequest: (state) => {
      state.addCommentDone = false;
      state.addCommentLoading = true;
    },
    addCommentSuccess: (state , action) => {
      const result = state.mainPosts.find(v => v.id === action.data.PostId)
      result.Comments.unshift(action.data);
      state.addCommentLoading = false;
      state.addCommentDone = true;
    },
    addCommentFailure: (state,action) => {
      state.addCommentLoading = false;
      openNotification(action.error)
    },

    addPostRequest: (state) => {
      state.addPostLoading = true;
      state.addPostDone = false;
    },
    addPostSuccess: (state , action) => {
      state.mainPosts.unshift(action.data)
      state.addPostLoading = false;
      state.addPostDone = true;
    },
    addPostFailure: (state,action) => {
      state.addPostLoading = false;
      openNotification(action.error)
    },

    updatePostRequest: (state) => {
      state.updatePostLoading = true;
    },
    updatePostSuccess: (state,action) => {
      const result = state.mainPosts.find(v => v.id === action.data.PostId)
      result.content = action.data.content;
      if(action.data.images) {
        result.Images = result.Images ? result.Images.concat(action.data.images) : action.data.images;
      }
      
      state.updatePostLoading = false;
    },
    updatePostFailure: (state ,action) => {
      state.updatePostLoading = false;
      openNotification(action.error)
    },

    removePostRequest: (state) => {
      
    },
    removePostSuccess: (state , action) => {
      state.mainPosts = state.mainPosts.filter(v => v.id !== action.data.PostId)
    },
    removePostFailure: (state , action) => {
      openNotification(action.error)
    },

    likeRequest: (state) => {

    },
    likeSuccess: (state,action) => {
      const post = state.mainPosts.find(v => v.id === action.data.PostId);
      post.Likers.push({ id: action.data.UserId , ...action.data });
    },
    likeFailure: (state , action) => {
      openNotification(action.error)
    },

    unLikeRequest: (state) => {

    },
    unLikeSuccess: (state,action) => {
      const post = state.mainPosts.find(v => v.id === action.data.PostId);
      post.Likers = post.Likers.filter(v => v.id !== action.data.UserId);
    },
    unLikeFailure: (state) => (state , action) => {
      openNotification(action.error)
    },

    loadPostByUserId: (state) => {

    },
    loadPostByUserIdSuccess: (state , action) => {
      state.mainPosts = action.data;
    },
    loadPostByUserIdFailure: (state , action) => {
      openNotification(action.error)
    },

    retweetRequest: (state) => {

    },
    retweetSuccess: (state , action) => {
      state.mainPosts.unshift(action.data);
    },
    retweetFailure: (state , action) => {
      openNotification(action.error)
    },

    postByHashTagRequest: (state) => {
      state.searchHashTagLoading = true;
    },
    postByHashTagSuccess: (state, action) => {
      state.mainPosts = action.data
      state.searchHashTagLoading = false;
    },
    postByHashTagFailure: (state,action) => {
      openNotification(action.error)
      state.searchHashTagLoading = false;
    },

    addPostImageRequest: (state) => {

    },
    addPostImageSuccess: (state,action) => {
      state.saveFileList = state.saveFileList.concat(action.data);
    },
    addPostImageFailure: (state,action) => {
      openNotification(action.error)
    },

    removeAllImageRequest: (state) => {
        state.removeFileListLoading = true;
    },
    removeAllImageSuccess: (state,action) => {
      state.saveFileList = [];
      state.removeFileListLoading = false;
    },
    removeAllImageFailure: (state,action) => {
      state.removeFileListLoading = false;
      openNotification(action.error)
    },
    
    removeImageRequest: (state) => {
    },
    removeImageSuccess: (state,action) => {
      const findPost = state.mainPosts.find(post => post.id === action.data.postId);
      if(findPost) {
        findPost.Images = findPost.Images.filter(img => img.id !== action.data.imgId)
      }
      state.saveFileList = state.saveFileList.filter(file => file.filename !== action.data.filename)
    },
    removeImageFailure: (state,action) => {
      openNotification(action.error)
    },


    setSaveFileList: (state,action) => {
      state.saveFileList = action.payload;
    },


    
  },
});

export const post = postSlice.reducer;
export const postAction = postSlice.actions;