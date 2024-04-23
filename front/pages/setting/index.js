import { Button, Col, Divider, Row, Switch } from "antd";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userAction } from "../../reducers/user";



const Setting = () => {
    const dispatch = useDispatch();
    const reception = useSelector((state) => state.user?.user?.notiReception);

    useEffect(() => {
        dispatch(userAction.loadUserRequest());
    }, []);

    const changeSwitch = useCallback(() => {
        const data = {reception}
        dispatch(userAction.updateRecptionRequest(data));
    },[])

    const SwitchComponent = useCallback(() => {
        const opt = {}
        if(reception === 'Y') {
            opt['defaultChecked'] ='defaultChecked'
        }

        return <Switch onChange={changeSwitch} {...opt}/>
    },[reception])
    return (
        <>
            <Row justify="center" >
                <Col span={2}></Col>
                <Col span={6}></Col>
            </Row>
            <Divider />
            <Row justify="center" >
                <Col span={2}><h3 className="setting-span-header">멘션 알림</h3></Col>
                <Col span={6}><SwitchComponent  /> </Col>
            </Row>
            <div><Divider /></div>
            <Row justify="center" >
                <Col span={2}><h3 className="setting-span-header">회원 탈퇴</h3></Col>
                <Col span={6}><Button shape="round" type="primary" danger>회원 탈퇴</Button></Col>
            </Row>
            <Row justify="center" >
                <Col span={8}><h3 className="setting-span-body">탈퇴 시 작성하신 포스트 및 댓글이 모두 삭제되며 복구되지 않습니다.</h3></Col>
            </Row>
            
        </>
    )
}

export default Setting;