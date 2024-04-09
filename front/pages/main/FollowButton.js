import { Button } from 'antd';
import { useCallback } from 'react';
import { userAction } from '../../reducers/user';
import { useDispatch, useSelector } from 'react-redux';

const FollowButton = ({targetId , followings}) => {
    const { id : me } = useSelector((state) => state.user.user)
    const followLoading = useSelector((state) => state.user.followLoading);
    const dispatch = useDispatch();
    const findUser = followings.find(v => v.id === targetId)


    const follow = useCallback(() => {
        const data = {
            targetId : targetId,
            type: findUser ? 'unFollow' : 'follow'
        }
        dispatch(userAction.followRequest(data))
    },[findUser])
    
    return (
        <>
            {me !== targetId ? <Button loading={followLoading} onClick={follow}>{findUser ? '언팔로우' : '팔로우'}</Button> : null}
        </>
    )
}

export default FollowButton;
