import { all, call, delay, fork, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { post, postAction } from '../reducers/post'
import { userAction } from '../reducers/user';



function loadPostsAPI(data = {}) {
  return axios.get(`/post?lastId=${data.lastId || 0}`);
}


function* loadPosts(action) {
    try {
        const result = yield call(loadPostsAPI,action.payload);
        yield put({
          type: postAction.loadPostsSuccess,
          data: result.data,
        });
    } catch (err) {
        console.error(err);
        yield put({
          type: postAction.loadPostsFailure,
          error: err.response.data,
        });
    }
}

function addCommentAPI(data) {
  return axios.post("/post/comment",data);
}


function* addComment(action) {
    try {
        const result = yield call(addCommentAPI,action.payload);
        yield put({
          type: postAction.addCommentSuccess,
          data: result.data
        });
    } catch (err) {
        console.error(err);
        yield put({
          type: postAction.addCommentFailure,
          error: err.response.data,
        });
    }
}


function logInAPI(data){
  return axios.post("/post/addpost",data)
}

function* addPost(action) {
  try {
       const result = yield call(logInAPI,action.payload);
      yield put({
        type: postAction.addPostSuccess,
        data: result.data
      });
      yield put({
        type: userAction.addPostToMe,
        data: result.data
      });
  } catch (err) {
      console.error(err);
      yield put({
        type: postAction.addPostFailure,
        error: err.response.data,
      });
  }
}

function updatePostAPI(data) {
  return axios.post(`/post/post/${data.postId}`,data);
}

function* updatePost(action) {
  try {
      const result = yield call(updatePostAPI,action.payload);
      yield put({
        type: postAction.updatePostSuccess,
        data: result.data
      });
  } catch (err) {
      console.error(err);
      yield put({
        type: postAction.updatePostFailure,
        error: err.response.data,
      });
  }
}

function removePostAPI(data) {
  return axios.delete(`/post/${data.postId}`);
}

function removeImageByPoseIdAPI(data) {
  axios.delete(`/upload/removeall/${data.postId}`);
}

function* removePost(action) {
  try {
      yield call(removeImageByPoseIdAPI,action.payload);
      const result = yield call(removePostAPI,action.payload);
      yield put({
        type: postAction.removePostSuccess,
        data: result.data
      });
      yield put({
        type: userAction.removePostToMe,
        data: result.data
      })
  } catch (err) {
      console.error(err);
      yield put({
        type: postAction.removePostFailure,
        error: err.response.data,
      });
  }
}


function likeAPI(data) { 
  return axios.post("/post/like",data);
}

function* like(action) {
  try{
    const result = yield call(likeAPI,action.payload);
    yield put({
      type: postAction.likeSuccess,
      data: result.data
    })
  } catch(err) {
    console.log(err);
    yield put({
      type: postAction.likeFailure,
      error: err.response.data
    })
  } 
}

function unlikeAPI(data) {
  return axios.delete(`/post/${data.postId}/like`);
}

function* unlike(action) {
  try{
    const result = yield call(unlikeAPI,action.payload)
    yield put({
      type:postAction.unLikeSuccess,
      data: result.data
    })
  } catch (err) {
    console.log(err);
    yield put({
      type:postAction.unLikeFailure,
      error: err.response.data
    })
  }
}

function loadPostByUserIdAPI(data) {
  return axios.get(`/post?id=${data.userId}`)
}

function* loadPostByUserId(action) {
  try{
    const result = yield call(loadPostByUserIdAPI,action.payload)
    yield put({
      type: postAction.loadPostByUserIdSuccess,
      data: result.data
    })
  } catch (err) {
    yield put({
      type:postAction.loadPostByUserIdFailure,
      error: err.response.data
    })
  }
}

function retweetAPI(data) {
  return axios.post('/post/retweet',data);
}

function* retweet(action) {
  try{
    const result = yield call(retweetAPI,action.payload)
    yield put({
      type:postAction.retweetSuccess,
      data:result.data,
    })
    
  } catch (err) {
    yield put({
      type: postAction.retweetFailure,
      error: err.response.data
    })
  }
}

function postByHashTagAPI(data) {
  return axios.get(`/post/hashtag/${data.hashtag}`)
}

function* postByHashTag(action) {
  try{
    const result = yield call(postByHashTagAPI,action.payload)
    yield put({
      type: postAction.postByHashTagSuccess,
      data: result.data
    })
  } catch(err) {
    yield put({
      type: postAction.postByHashTagFailure,
      error: err.response.data
    })
  }
}

async function addPostImageAPI(data) {
  return axios.post("/upload/upload",data.formData,{
    onUploadProgress: (progressEvent) => {
        let per = (progressEvent.loaded * 100) / progressEvent.total;
        per = Math.round(per);
        const fn = data.setPer;
        fn(per)
    },
    header: {
      "Context-Type" : "multipart/form-data"
    }
  })
}

function* addPostImage(action) {
  try{
    const result = yield call(addPostImageAPI, action.payload);
    yield put({
      type: postAction.addPostImageSuccess,
      data: result.data
    })
  } catch (err) {
    yield put({
      type: postAction.addPostImageFailure,
      error: err.response.data
    })
  }
}

function removeAllImageAPI(data) {
  return axios.post("/upload/removelist",data);
}

function* removeAllImage(action) {
  try{
    const result = yield call(removeAllImageAPI, action.payload);
    yield put({
      type: postAction.removeAllImageSuccess,
      data: result.data
    })
  } catch (err) {
    yield put({
      type: postAction.removeAllImageFailure,
      error: err.response.data
    })
  }
}

function removeImageAPI(data) {
  return axios.post("/upload/removeimage",data);
}

function* removeImage(action) {
  try{
    const result = yield call(removeImageAPI, action.payload);
    result.data.postId = action.payload.postId
    yield put({
      type: postAction.removeImageSuccess,
      data: result.data
    })
  } catch (err) {
    console.log(err)
    yield put({
      type: postAction.removeImageFailure,
      error: err.response.data
    })
  }
}

function* takeLoadPosts () {
    yield takeLatest(postAction.loadPostsRequest, loadPosts);
}

function* takeAddComment () {
    yield takeLatest(postAction.addCommentRequest, addComment)
}

function* takeAddPost () {
  yield takeLatest(postAction.addPostRequest, addPost)
}

function* takeUpdatePost() {
  yield takeLatest(postAction.updatePostRequest, updatePost)
}

function* takeRemovePost() {
  yield takeLatest(postAction.removePostRequest, removePost)
}

function* takeLike() {
  yield takeLatest(postAction.likeRequest, like)
}

function* takeunLike() {
  yield takeLatest(postAction.unLikeRequest, unlike)
}

function* takeLoadPostByUserId() {
  yield takeLatest(postAction.loadPostByUserId, loadPostByUserId)
}

function* takeRetweet() {
  yield takeLatest(postAction.retweetRequest, retweet)
}

function* takePostByHashTag() {
  yield takeLatest(postAction.postByHashTagRequest, postByHashTag)
}

function* takeAddPostImage() {
  yield takeLatest(postAction.addPostImageRequest,addPostImage)
}

function* takeRemoveAllImage() {
  yield takeLatest(postAction.removeAllImageRequest,removeAllImage)
}

function* takeRemoveImage() {
  yield takeLatest(postAction.removeImageRequest, removeImage)
}


export default function* postSaga() {
    yield all([
        fork(takeLoadPosts),
        fork(takeAddComment),
        fork(takeAddPost),
        fork(takeUpdatePost),
        fork(takeRemovePost),
        fork(takeLike),
        fork(takeunLike),
        fork(takeLoadPostByUserId),
        fork(takeRetweet),
        fork(takePostByHashTag),
        fork(takeAddPostImage),
        fork(takeRemoveAllImage),
        fork(takeRemoveImage),
    ])
}
