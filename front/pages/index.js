import Layout from './components/Layout'
import PostCard from './main/PostCard';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { postAction } from '../reducers/post';
import { userAction } from '../reducers/user';
import { throttle } from "lodash";


const Main = ({darkModeHandler}) => {
    const { isLogin } = useSelector((state) => state.user);
    const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector((state) => state.post);
    const dispatch = useDispatch();
    const followings = useSelector((state) => state.user?.user?.Followings);
    useEffect(() => {
        dispatch(userAction.loadUserRequest());
        dispatch(postAction.loadPostsRequest());
    }, []);

    useEffect(() => {
        const onScroll = throttle(() => {
            if (window.pageYOffset + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
                if (hasMorePosts && !loadPostsLoading) {
                  const lastId = mainPosts[mainPosts.length - 1]?.id;
                  dispatch(postAction.loadPostsRequest({lastId}));
                }
              }
         } , 500);

        window.addEventListener('scroll',onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
          };
    }, [hasMorePosts, loadPostsLoading, mainPosts])
    
    
    return (
        <Layout darkModeHandler={darkModeHandler}>
            {isLogin && mainPosts ? mainPosts.map( post => <PostCard followings={followings} post={post} key={post.id}/>) : null}
        </Layout>
    )
}

export default Main;