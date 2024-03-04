import { Button } from 'antd';
import { useCallback } from 'react';
import { userAction } from '../../reducers/user';
import { useDispatch, useSelector } from 'react-redux';

const FollowButton = ({post , followings}) => {
    const { id : me } = useSelector((state) => state.user.user)
    const followLoading = useSelector((state) => state.user.followLoading);
    const dispatch = useDispatch();
    const findUser = followings.find(v => v.id === post.User.id)
    const follow = useCallback(() => {
        const data = {
            targetId : post.User.id,
            type: findUser ? 'unFollow' : 'follow'
        }
        dispatch(userAction.followRequest(data))
    },[findUser])
    return (
        <>
            {me !== post.User.id ? <Button loading={followLoading} onClick={follow}>{findUser ? '언팔로우' : '팔로우'}</Button> : null}
        </>
    )
}

export default FollowButton;
