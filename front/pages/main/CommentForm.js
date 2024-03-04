import { Button, Form, Input } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postAction } from '../../reducers/post';

const CommentForm = ({post}) => {
    const [commentText,setCommentText] = useState('');
    const dispatch = useDispatch();
    const { id:userId , nickname } = useSelector((state) => state.user.user);
    const { addCommentLoading , addCommentDone } = useSelector((state) => state.post);
    
    const onSubmitComment = useCallback(() => {
        const data = { content: commentText, userId: userId, postId: post.id ,nickname:nickname}
        dispatch(postAction.addCommentRequest(data))
      }, [commentText]);
    
      useEffect(() => {
        if (addCommentDone) {
          setCommentText('');
        }
      }, [addCommentDone]);

      const onChangeCommentText = useCallback((e) => {
        setCommentText(e.target.value);
      }, []);

    return(
        <>
            <Form onFinish={onSubmitComment}>
                <Form.Item style={{ position: 'relative', margin: 0 }}>
                    <Input.TextArea rows={4} value={commentText} onChange={onChangeCommentText} />
                    <Button loading={addCommentLoading} style={{ position: 'absolute', right: 0, bottom: -40, zIndex:1 }} type="primary" htmlType="submit">등록</Button>
                </Form.Item>
            </Form>
        </>
    )
}

export default CommentForm;