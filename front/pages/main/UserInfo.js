import { Card, Button, Avatar} from 'antd';
import { useSelector , useDispatch } from 'react-redux';
import { userAction } from '../../reducers/user'
import styled from 'styled-components';
import Link from 'next/link';
import { useCallback, useEffect, useRef } from 'react';
import PostForm from './PostForm';
import { postAction } from '../../reducers/post';
import { notiAction } from '../../reducers/notification';
import { useRouter } from 'next/router';

const ButtonWrapper = styled(Button)`
    top: 10px;
`



const UserInfo = () => {
    const aRef = useRef();
    const router = useRouter();
    const dispatch = useDispatch();
    const { user , logoutLoading } = useSelector((state) => state.user);

    const onLogout = () => {
        if(user.provider === 'kakao') {
            aRef.current.click()
        } else {
            const data = {
                provider : user.provider
            }
            dispatch(userAction.logoutRequest(data))
        }
        
    }

    useEffect(() => {
        const state = new URL(location.href).searchParams.get("state");
        if(state) {
            dispatch(userAction.logoutRequest());
            router.push('/');
            dispatch(notiAction.logoutRequest())
        }
    },[])
    
    const modalRef = useRef();

    const onPostForm = useCallback(() => {
        dispatch(postAction.setSaveFileList([]))
        modalRef.current.setIsModalOpen(true);
    },[])

    const SocialLogout = useCallback(() => {
        const kakaoLogoutURL=process.env.NEXT_PUBLIC_KAKAO_LOGOUT_URL;
        const kakaoClientId=process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
        const kakaoRedirectURL=process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URL;
    
        const style = {display:'none'};
    
    
        if(user.provider === 'kakao') {
            return <a ref={aRef} style={style} href={`${kakaoLogoutURL}?client_id=${kakaoClientId}&logout_redirect_uri=${kakaoRedirectURL}&state=logout`} ></a>
        }
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

            <SocialLogout/>
        </>
            
        
    )
}

export default UserInfo;