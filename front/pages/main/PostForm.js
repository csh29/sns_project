import { Form ,Input, Button, Card, Avatar, } from 'antd';
import useInput from '../components/UseInput'
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import { postAction } from '../../reducers/post';
import { useCallback } from 'react';
import { ModalComponent , FileUploader } from '../components/Component'

const PostForm = ({modalRef,propsValue,propsOnChange,post,isNew}) => {
    const dispatch = useDispatch();
    const textInput = useInput('');
    const { value , onChange , setValue } = textInput;
    const { addPostDone } = useSelector((state) => state.post)
    const saveFileList = useSelector((state) => state.post.saveFileList)
    
    useEffect(() => {
        if(propsValue) {
            setValue(propsValue)
        }
    },[])

    const onSubmit = useCallback(() => {
        if(post) {
            // 게시글 수정
            const uploadList = saveFileList.filter(file => file.size)
            const data = { content:propsValue , uploadList ,postId:post.id}
            dispatch(postAction.updatePostRequest(data));
        } else {
            // 새 게시글 작성
            const data = { text:value , saveFileList}
            dispatch(postAction.addPostRequest(data));
        }
        
        modalRef.current.setIsModalOpen(false);
      }, [value,saveFileList,propsValue]);

    const handleCancel = useCallback(() => {
        modalRef.current.setIsModalOpen(false);
        const removelist = saveFileList.filter(file => file.size)
        if(removelist?.length > 0) {
            dispatch(postAction.removeAllImageRequest({removelist}));
        }
    }, [saveFileList])
    
    useEffect(() => {
        if (addPostDone) {
            setValue('');
        }
      }, [addPostDone]);

    const removeImage = useCallback((name) => {
        const removeFile = saveFileList.find(file => file.filename === name);
        dispatch(postAction.removeImageRequest({removeFile,postId:post?.id}));
    }, [saveFileList])

    return (
        <>
            <ModalComponent
                title="게시글 작성"
                ref={modalRef}
                handleOk={onSubmit}
                handleCancel={handleCancel}
            >
                {
                    post ? 
                    <Card.Meta
                    avatar={ post.User.profileImageUrl ? <Avatar src={post.User.profileImageUrl}></Avatar> : <Avatar>{post.User.nickname[0]}</Avatar>}
                        title={post.User.nickname}
                    />
                    :
                    null
                }
                <Form style={{ margin: '10px 0 20px' }} encType="multipart/form-data" onFinish={onSubmit}>
                    <Input.TextArea style={{height:'300px'}} value={propsValue ? propsValue : value} onChange={propsOnChange ? propsOnChange : onChange} maxLength={140} placeholder="어떤 신기한 일이 있었나요?" />
                    <FileUploader removeImage={removeImage} ></FileUploader>
                </Form>      
            </ModalComponent>

        </>
    )
}

export default PostForm;