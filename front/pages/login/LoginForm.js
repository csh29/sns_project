import { Button , Divider, Form } from 'antd';
import Link from 'next/link';
import useInput from '../components/UseInput'
import { TextComponent } from '../components/Component'
import styled from 'styled-components';
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect } from 'react';
import { userAction } from '../../reducers/user'
import SocialKakao from '../sociallogin/kakao/kakao';

const DivWrapper = styled.div`
    margin-top : 10px;
    display: flex;
    flex-direction: column;
    width: 60%;
    align-items: center;
`

const ButtonWrapper = styled(Button)`
    margin-bottom: 5px;
    width: 68%;
    border-radius: 6px;
`

const LoginForm = () => {
    const { loginLoading } = useSelector((state) => state.user);

    const dispatch = useDispatch();
    const emailInput = useInput('');
    const passwordInput = useInput('');

    const email =  emailInput.value;
    const password = passwordInput.value;
    const onSubmitForm = useCallback(() => {
        const data = { email,password }
        dispatch(userAction.loginRequest(data));
      }, [email, password]);


    return (
        <Form onFinish={onSubmitForm} style={{ padding: '10px' }}>
            <TextComponent data={emailInput} name={'이메일'}/>
            <TextComponent data={passwordInput} name={'비밀번호'}/>
            <DivWrapper>
                <ButtonWrapper loading={loginLoading} type="primary" htmlType="submit">로그인</ButtonWrapper>
                <Link href="/login/Signup"><ButtonWrapper >회원가입</ButtonWrapper></Link>
                <Divider>or</Divider>
                <SocialKakao/>
            </DivWrapper>            
        </Form>
            
    )
}

export default LoginForm;