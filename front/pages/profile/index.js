import { useRouter } from 'next/router';
import Layout from '../components/Layout'
import Head from 'next/head';
import NicknameEditForm from './NicknameEditForm';
import FollowList from './FollowList';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { userAction } from '../../reducers/user';
import { FormWrapper } from './ProfileStyle'
import { Avatar } from 'antd';
const Profile = ({darkModeHandler}) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const isLogin = useSelector((state) => state.user.isLogin);
    const [ userId ,setUserId ] = useState('');
    const user = userId ? useSelector((state) => state.user.searchUser) : useSelector((state) => state.user.user);
    const Followings = user?.Followings
    const Followers = user?.Followers
    const nickname = user?.nickname

    useEffect(() => {
        if(!isLogin) {
          router.push('/');
        }
      }, []);

    useEffect(() => {
        const id = new URLSearchParams(decodeURIComponent(location.search)).get("id");
        setUserId(id);
        if(id) {
            const data = { userId : id }
            dispatch(userAction.searchUserRequest(data));
        }
    }, [router.query])

    if(!isLogin) {
        return null;
    }

    const ProfileInfo = (() => {
        if(!user?.nickname) return false;
        return (
            <FormWrapper>
                {
                    user?.profileImageUrl 
                    ? <Avatar src={user?.profileImageUrl}></Avatar>
                    : <Avatar ><span >{user?.nickname[0]}</span></Avatar>
                }  
                <span style={{marginLeft:'10px'}}>{nickname}님의 프로필정보</span> 
            </FormWrapper>
        )
    })
    

    return (
        <>
            <Layout darkModeHandler={darkModeHandler}>
                <Head>
                    <title> 프로필 </title>
                </Head>
                { userId ?  <ProfileInfo /> : <NicknameEditForm/>} 
                <FollowList
                    header="팔로워 목록"
                    data={Followers}
                />
                <FollowList
                    header="팔로잉 목록"
                    data={Followings}
                />
            </Layout>
        </>
    )
}

export default Profile;