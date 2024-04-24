import { Menu,  Input, Col, Row, Switch, Avatar, Dropdown, Space  } from 'antd';
import Link from 'next/link';
import LoginForm from "../login/LoginForm";
import UserInfo from "../main/UserInfo";
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { postAction } from '../../reducers/post';
import { NotisMenu } from '../components/Component'
import { useRouter } from 'next/router';

const DivWrapper = styled.div`
    width: 99%;

    .ant-card-actions > li {
        margin : 0 0 0 0px;
        padding-top:12px;
        padding-bottom:12px;
    }
    
`
const LinkWrapper = styled.a`
    color: var(--color-primary) !important;
`

const Layout = ({children,darkModeHandler}) => {
    const router = useRouter();
    const { isLogin , user , searchHashTagLoading } = useSelector((state) => state.user);
    
    const [defaultChecked,setDefaultChecked] = useState(false);
    const dispatch = useDispatch();
    
    const DropdownAvatar = useCallback(({user}) => {
        if(!user) return null;

        const items = [{
              label: <Link href={`/setting/`}><div>설정</div></Link>,
              key: '0',
            },{
                type: 'divider',
            }];

        if(user.profileImageUrl) {
            return (
                <Dropdown menu={{ items }} trigger={['click']}>
                    <Space>
                        <Avatar style={{cursor:'pointer'}} src={user.profileImageUrl}></Avatar>
                    </Space>
                </Dropdown>
            )
        } else {
            return (
                <Dropdown menu={{ items }} trigger={['click']}>
                    <Space>
                        <Avatar style={{cursor:'pointer'}} >{user.nickname[0]}</Avatar>
                    </Space>
                </Dropdown>
            )
        }
    },[user])

    useEffect(() => {
        if(typeof window !== 'undefined') {
            const isDarkMode = sessionStorage.getItem("isDarkMode") === 'true' ? true : false;
            setDefaultChecked(isDarkMode)
            if (isDarkMode) {
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

    const MenuComponent = ({defaultChecked}) => {
        const menuItems = [
            {
                label: <Link href="/"><LinkWrapper>Home</LinkWrapper></Link>,
                key: "home",
            },
            {
                label: <Link href={`/profile`}><LinkWrapper>Profile</LinkWrapper></Link>,
                key: "profile",
            },
            {
                label: <Input.Search loading={searchHashTagLoading} onSearch={searchHashTag} placeholder='해시태그' enterButton style={{ verticalAlign: 'middle' }} />,
                key: "mail",
            },
            {
                
                label: <NotisMenu ></NotisMenu>,
                key: "notification",
            },
        ];

        if(defaultChecked) {
            menuItems.push({
                label:   <Switch onChange={darkModeHandler} defaultChecked></Switch>,
                key: "colorMode",
            })
        } else {
            menuItems.push({
                label: <Switch onChange={darkModeHandler}></Switch>,
                key: "colorMode",
            })
        }
        menuItems.push({
            label: <DropdownAvatar user={user}/>,
            id:'dropdownAvatar-common',
            key: "info",
        },)

        return <Menu mode="horizontal" items={menuItems}></Menu>
        
    }

    if(router.pathname.indexOf("setting") !== -1) {
        return (
            <DivWrapper>
                <MenuComponent defaultChecked={defaultChecked}/>
                <Row gutter={8}>
                    <Col xs={24} md={6}>
                    </Col>
                    <Col xs={24} md={12}>
                     {children}
                    </Col>
                </Row>
            </DivWrapper>
        )
    } else {
        return (
            <DivWrapper>
                <MenuComponent defaultChecked={defaultChecked}/>
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
    }
    

export default Layout;