import { Card, Button, Avatar} from 'antd';
import { useSelector , useDispatch } from 'react-redux';
import { userAction } from '../../reducers/user'
import styled from 'styled-components';
import Link from 'next/link';
import { useCallback, useEffect, useRef } from 'react';
import PostForm from './PostForm';
import { postAction } from '../../reducers/post';
import { useRouter } from 'next/router';

const clientId = '30f0f673e02dd45bc7b95d201a90e033'
const redirectURI = 'http://localhost:3000';
const ButtonWrapper = styled(Button)`
    top: 10px;
`

const UserInfo = () => {
    const aRef = useRef();
    const router = useRouter();
    const dispatch = useDispatch();
    const { user , logoutLoading } = useSelector((state) => state.user);

    const onLogout = () => {
        if(user.sociallogin === 'Y') {
            aRef.current.click()
        } else {
            dispatch(userAction.logoutRequest())
        }
    }

    useEffect(() => {
        const state = new URL(location.href).searchParams.get("state");
        if(state) {
            dispatch(userAction.logoutRequest());
            router.push('/');
        }
    },[])
    
    const modalRef = useRef();

    const onPostForm = useCallback(() => {
        dispatch(postAction.setSaveFileList([]))
        modalRef.current.setIsModalOpen(true);
    },[])

    return (
        <>
             <Card
                actions={[
                    <Link href={`/userinfo/${user.id}`}><div className="userinfo_css" key="twit">게시글<br />{user.Posts.length}</div></Link>,
                    <Link href={`/profile`}><div className="userinfo_css" key="following">팔로잉<br />{user.Followings.length}</div></Link>,
                    <Link href={`/profile`}><div className="userinfo_css" key="follower">팔로워<br />{user.Followers.length}</div></Link>,
                ]}
                >
                <Card.Meta
                    avatar={ user.profileImageUrl ? <Avatar src={user.profileImageUrl}></Avatar> : <Avatar>{user.nickname[0]}</Avatar>}
                    title={user.nickname}
                />
                <ButtonWrapper style={{float: 'left'}} loading={logoutLoading} onClick={onPostForm}>게시글 작성</ButtonWrapper>
                <ButtonWrapper style={{float: 'right'}} loading={logoutLoading} onClick={onLogout}>로그아웃</ButtonWrapper>
            </Card>
            

            <PostForm modalRef={modalRef}/>

            <a ref={aRef} style={{display:'none'}} href={`https://kauth.kakao.com/oauth/logout?client_id=${clientId}&logout_redirect_uri=${redirectURI}&state=logout`} ></a>
        </>
            
        
    )
}

export default UserInfo;