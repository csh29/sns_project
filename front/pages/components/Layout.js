import { Menu,  Input, Col, Row, Switch  } from 'antd';
import Link from 'next/link';
import LoginForm from "../login/LoginForm";
import UserInfo from "../main/UserInfo";
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect } from 'react';
import { userAction } from '../../reducers/user';
import { postAction } from '../../reducers/post';

const DivWrapper = styled.div`
    width: 99%;

    .ant-card-actions > li {
        margin : 0 0 0 0px;
        padding-top:12px;
        padding-bottom:12px;
    }
    
`


  

const Layout = ({children,darkModeHandler}) => {
    const { isLogin , user , searchHashTagLoading } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    let defaultChecked = false;
    useEffect(() => {
        if(typeof window !== 'undefined') {
            defaultChecked = sessionStorage.getItem("isDarkMode") === 'true' ? true : false;
            if (defaultChecked) {
                document.body.setAttribute("data-theme", "dark");
            } else {
                document.body.setAttribute("data-theme", "light");
            }
        }
    }, []);

    const searchHashTag = useCallback((hashtag) => {
        const data = {hashtag}
        dispatch(postAction.postByHashTagRequest(data));
    }, [])

    
    const menuItems = [
        {
        label: <Link href="/"><a>Home</a></Link>,
        key: "home",
        },
        {
        label: <Link href={`/profile`}><a>Profile</a></Link>,
        key: "profile",
        },
        {
        label: <Input.Search loading={searchHashTagLoading} onSearch={searchHashTag} placeholder='해시태그' enterButton style={{ verticalAlign: 'middle' }} />,
        key: "mail",
        },
        {
        label:   defaultChecked ? <Switch onChange={darkModeHandler} defaultChecked></Switch> : <Switch onChange={darkModeHandler}></Switch>,
        key: "colorMode",
        }
    ];

    
    return (
        <DivWrapper>
            <Menu mode="horizontal" items={menuItems}>
                
            </Menu>
            <Row gutter={8}>
                <Col xs={24} md={6}>
                {!isLogin ? <LoginForm /> : <UserInfo user={user}/>}
                </Col>
                <Col xs={24} md={12}>
                 {children}
                </Col>
            </Row>

        </DivWrapper>
    )
}

export default Layout;