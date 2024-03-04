import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postAction } from "../../reducers/post";
import PostCard from "../main/PostCard";
import Layout from '../components/Layout'
import { userAction } from "../../reducers/user";

const Hashtag = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector((state) => state.post);
    const followings = useSelector((state) => state.user?.user?.Followings);

    const { id : hashtag } = router.query;
    useEffect(() => {
        dispatch(userAction.loadUserRequest());
        dispatch(postAction.postByHashTagRequest({hashtag:hashtag}))
    },[hashtag])

    console.log(mainPosts)
    return (
        <Layout>
            {   
                mainPosts.map(post => <PostCard post={post} key={post.id} followings={followings}/>)
            }
            

        </Layout>
    )
}

export default Hashtag;