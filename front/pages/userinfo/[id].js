import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import PostCard from '../main/PostCard';
import { useEffect } from 'react';
import { postAction } from '../../reducers/post';
import { userAction } from '../../reducers/user';


const UserInfo = ({darkModeHandler}) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { id : userId } = router.query;
    const userInfo = useSelector((state) => state.user.searchUser)
    const mainPosts = useSelector((state) => state.post.mainPosts)
    const followings = useSelector((state) => state.user?.user?.Followings);

    useEffect(() => {
        const data = { userId }
        dispatch(postAction.loadPostByUserId(data));
        dispatch(userAction.searchUserRequest(data));
    }, []);

    return (
        <Layout darkModeHandler={darkModeHandler}>
            <Head>
                <title>
                    {userInfo.nickname}님의 글
                </title>
            </Head>

            {mainPosts.map(post => <PostCard followings={followings} post={post} key={post.id}/>)}
        </Layout>
    )
}

export default UserInfo;