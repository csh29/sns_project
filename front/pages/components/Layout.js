import { Menu,  Input, Col, Row, Switch, Badge  } from 'antd';
import Link from 'next/link';
import LoginForm from "../login/LoginForm";
import UserInfo from "../main/UserInfo";
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { postAction } from '../../reducers/post';
import { NotificationOutlined } from '@ant-design/icons';
import { NotisMenu } from '../components/Component'
import { notiAction } from '../../reducers/notification';

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
    const { isLogin , user , searchHashTagLoading } = useSelector((state) => state.user);
    const { notisData } = useSelector((state) => state.noti);
    const [defaultChecked,setDefaultChecked] = useState(false);
    const dispatch = useDispatch();

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

    useEffect(() => {
        const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_NODE_SERVER}/notification/load`,
        {
          withCredentials: true,
          Accept: 'text/event-stream',
          'Content-Type': 'text/event-stream; charset=utf-8'
        }
       );

  
      eventSource.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        dispatch(notiAction.setNotisData(data));
      });
  
      return () => {
        eventSource.close()
      }
    },[isLogin])

    const searchHashTag = useCallback((hashtag) => {
        const data = {hashtag}
        dispatch(postAction.postByHashTagRequest(data));
    }, [])

    console.log(notisData)
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
                
                label: <NotisMenu data={notisData}><Badge count={notisData.length}><NotificationOutlined style={{fontSize:'18px',marginRight:'5px'}}/></Badge></NotisMenu>,
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

        return <Menu mode="horizontal" items={menuItems}></Menu>
        
    }


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

export default Layout;