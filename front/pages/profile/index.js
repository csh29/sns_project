import { useRouter } from 'next/router';
import Layout from '../components/Layout'
import Head from 'next/head';
import NicknameEditForm from './NicknameEditForm';
import FollowList from './FollowList';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const Profile = ({darkModeHandler}) => {
    const router = useRouter();
    const isLogin = useSelector((state) => state.user.isLogin);
    

    useEffect(() => {
        if(!isLogin) {
          router.push('/');
        }
      }, []);

    if(!isLogin) {
      
        return null;
    }

    const { Followings , Followers } = useSelector((state) => state.user.user);

    return (
        <>
            <Layout darkModeHandler={darkModeHandler}>
                <Head>
                    <title> 프로필 </title>
                </Head>
                <NicknameEditForm/>
                <FollowList
                    header="팔로우 목록"
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