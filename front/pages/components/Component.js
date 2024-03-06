import {  Input , Modal , Dropdown , Space } from 'antd';
import Link from 'next/link';
import { useCallback, useState, useImperativeHandle , forwardRef } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { userAction } from '../../reducers/user';

const InputWrapper = styled(Input)`
    width: 59%;
    margin-bottom: 5px;
`


const ContextMenu = ({children,user,followings}) => {
    const dispatch = useDispatch();
    const findUser = followings.find(v => v.id === user.id);
    
    const follow = useCallback(() => {
        
        const data = {
            targetId : user.id,
            type: findUser ? 'unFollow' : 'follow'
        }
        dispatch(userAction.followRequest(data))
    },[])

    const items = [
        {
          label: <Link href={`/userinfo/${user.id}`}><div>게시글 보기</div></Link>,
          key: '0',
        },
        {
            type: 'divider',
        },
        {
          label: <div onClick={follow}> {findUser ? '언팔로우' : '팔로우'} </div>,
          key: '1',
        },
        
      ];

    const { id : me } = useSelector((state) => state.user.user)
    if(me === user.id) {
        items.pop()
    }

    return (
        <Dropdown menu={{ items }} trigger={['click']}>
            <Space>
                {children}
            </Space>
        </Dropdown>
    )
}

const TextComponent = ({data , name}) => {
    const { value , onChange } = data;
    return (
        <>
            <label>{name}</label>
            <br/>
            <InputWrapper
                value={value}
                onChange={onChange}
                name={name}
            />
            <br/>
        </>
    )
}


const ModalComponent = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        setIsModalOpen
      }))

      
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCancel = useCallback(() => {
        setIsModalOpen(false);
    },[]);
    

    return (
        <Modal 
            title={props.title}
            open={isModalOpen} 
            onOk={props.handleOk} 
            onCancel={props.handleCancel ? props.handleCancel : handleCancel}
            okButtonProps={props.isLoading ? {disabled: true} : null}>
            {props.children}
        </Modal>
    )
});
  

export {ModalComponent,TextComponent,ContextMenu};