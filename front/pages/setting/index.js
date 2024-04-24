import { Avatar, Button, Col, Divider, Row, Switch } from "antd";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userAction } from "../../reducers/user";
import Layout from '../components/Layout'
import styled from "styled-components";


export const AvatarWrapper = styled(Avatar)`
  & span {
    padding-top: 10px;
  }
`;

const Setting = ({darkModeHandler}) => {
    const uploadRef = useRef();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const updateRecptionLoading = useSelector((state) => state.user.updateRecptionLoading);
    const reception = user?.notiReception;
    
    useEffect(() => {
        dispatch(userAction.loadUserRequest());
    }, []);

    const changeSwitch = useCallback(() => {
        dispatch(userAction.updateRecptionRequest());
    },[])

    const ProfileImage = useCallback(() => {
        if(user?.profileImageUrl) {
            return (
                <Avatar className="setting-avatar" src={user?.profileImageUrl}></Avatar>
            )
        } else {
            return (
                <AvatarWrapper className="setting-avatar"><span style={{fontSize: '55px'}}>{user?.nickname[0]}</span></AvatarWrapper>
            )
        }
    }, [user])

    const removeProfileImg = useCallback(() => {
        dispatch(userAction.removeProfileImgRequest());
    }, [])

    const uploadProfileImg = useCallback(() => {
        uploadRef.current.addEventListener('change', (e) => {
            const files = e.target.files;

            const data = {};
            const formData = new FormData()
            formData.append('file',files[0]);
            data.formData = formData;
            dispatch(userAction.uploadProfileImgRequest(data));
        })
        uploadRef.current.click()

    }, [])

    return (
        <Layout darkModeHandler={darkModeHandler}>
            <div style={{marginTop:'40px'}}>
                <Row justify="center" className="setting-profile-container">
                    <Col span={6}><ProfileImage/></Col>
                    <Col span={6}><Button shape="" type="primary" onClick={uploadProfileImg}>이미지 업로드</Button></Col>
                    <Col style={{marginTop:'10px'}} span={6}><Button onClick={removeProfileImg} shape="round" type="text"><span className="setting-span-body">이미지 제거</span></Button></Col>                    
                </Row>
                <div className="setting-divider"><Divider /></div>
                <Row justify="center" >
                    <Col span={12}><h3 className="setting-span-header">이메일주소</h3></Col>
                    <Col span={12}> {user?.email} </Col>
                </Row>
                <div className="setting-divider"><Divider /></div>
                <Row justify="center" >
                    <Col span={12}><h3 className="setting-span-header">멘션 알림</h3></Col>
                    <Col span={12}> <Switch onChange={changeSwitch}  checked={reception === 'Y' ? true : false}/> </Col>
                </Row>
                <div className="setting-divider"><Divider /></div>
                <Row justify="center" >
                    <Col span={12}><h3 className="setting-span-header">회원 탈퇴</h3></Col>
                    <Col span={12}><Button shape="round" type="primary" danger>회원 탈퇴</Button></Col>
                </Row>
                <Row justify="center" >
                    <Col span={24}><h3 className="setting-span-body">탈퇴 시 작성하신 포스트 및 댓글이 모두 삭제되며 복구되지 않습니다.</h3></Col>
                </Row>
            </div>


            <input ref={uploadRef} type="file" hidden></input>
        </Layout>
    )
}

export default Setting;