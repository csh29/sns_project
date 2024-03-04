import React, { useCallback, useState, useEffect } from 'react';
import Head from 'next/head';
import { Form, Input, Checkbox, Button, notification } from 'antd';
import Layout from '../components/Layout'
import { useDispatch, useSelector } from 'react-redux';
import { userAction } from '../../reducers/user'; 
import Router from 'next/router';
import useInput from '../components/UseInput';


const Signup = ({darkModeHandler}) => {
    const emailInput = useInput('');
    const nickNameInput = useInput('');
    const passwordInput = useInput('');
    const passwordCheckInput = useInput('');

    const email = emailInput.value;
    const nickname = nickNameInput.value;
    const password = passwordInput.value;
    const passwordCheck = passwordCheckInput.value;

    const dispatch = useDispatch();
    const { signupLoading , signUpDone } = useSelector((state) => state.user);

    useEffect(() => {
        if (signUpDone) {
          Router.replace('/');
        }
    }, [signUpDone]);

    const onSubmit = useCallback((e) => {
        if(password !== passwordCheck){
            openNotification()
            return false;
        }

        const data = {
            email,
            nickname,
            password,
        }
        dispatch(userAction.signupRequest(data));        

    },[email , nickname , password , passwordCheck])

    const openNotification = () => {
        notification.info({
            message: `Notification`,
            description:
              '비밀번호가 일치하지 않습니다.',
          });
    };
    
      
    return (
        <Layout darkModeHandler={darkModeHandler}>
            <Head>
                <title>회원가입 | NodeBird</title>
            </Head>
            <Form onFinish={onSubmit}>
                <div>
                <label htmlFor="user-email">이메일</label>
                <br />
                <Input name="user-email" type="email" value={emailInput.value} required onChange={emailInput.onChange} />
                </div>
                <div>
                <label htmlFor="user-nick">닉네임</label>
                <br />
                <Input name="user-nick" value={nickNameInput.value} required onChange={nickNameInput.onChange} />
                </div>
                <div>
                <label htmlFor="user-password">비밀번호</label>
                <br />
                <Input name="user-password" type="password" value={passwordInput.value} required onChange={passwordInput.onChange} />
                </div>
                <div>
                <label htmlFor="user-password-check">비밀번호체크</label>
                <br />
                <Input
                    name="user-password-check"
                    type="password"
                    value={passwordCheckInput.value}
                    required
                    onChange={passwordCheckInput.onChange}
                />
                </div>
                <div style={{ marginTop: 10 }}>
                <Button loading={signupLoading} type="primary" htmlType="submit" >가입하기</Button>
                </div>
            </Form>
        </Layout>
    )
}

export default Signup;