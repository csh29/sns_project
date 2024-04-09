import { Card, Button, Avatar, Popover, List, Comment} from 'antd';
import { RetweetOutlined, HeartOutlined, MessageOutlined, EllipsisOutlined, HeartFilled } from '@ant-design/icons';
import React, { useState, useCallback, useRef } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import PostImages from './PostImages'
import PostCardContent from './PostCardContent';
import CommentForm from './CommentForm';
import { useDispatch, useSelector } from 'react-redux';
import useInput from '../components/UseInput'
import { postAction } from '../../reducers/post';
import FollowButton from './FollowButton';
import { ContextMenu } from '../components/Component'
import PostForm from './PostForm';

const CardWrapper = styled.div`
  margin-bottom: 20px;

`;

export const Global = createGlobalStyle`
  .ant-card-head {
    border-bottom: 2px solid #f0f0f0;
  }
`

const PostCard = ({post , followings}) => {
    const modalRef = useRef();
    const dispatch = useDispatch();
    const [ comment , setOpenComment ] = useState(false);
    const id = useSelector((state) => state.user.user.id);
    const liked = post.Likers?.find((v) => v.id === id);
    

    const DropdownAvatar = useCallback(({user}) => {
        if(!user) return null;
        if(user.profileImageUrl) {
            return (
                <ContextMenu user={user} followings={followings}>
                    <Avatar style={{cursor:'pointer'}} src={user.profileImageUrl}></Avatar>
                </ContextMenu>
            )
        } else {
            return (
                <ContextMenu user={user} followings={followings}>
                    <Avatar style={{cursor:'pointer'}} >{user.nickname[0]}</Avatar>
                </ContextMenu>
            )
        }
    },[post,followings])

    const onToggleLike = useCallback(() => {
        const data = {
            postId:post.id,
        }
        if(liked) {
            dispatch(postAction.unLikeRequest(data))
        } else {
            dispatch(postAction.likeRequest(data))
        }
        
      }, [liked]);

    const openComment = useCallback(() => {
        setOpenComment((prev) => !prev);
    }, [])

    const modalInput = useInput(post.content);
    
    const showModal = () => {
        modalRef.current.setIsModalOpen(true);

        const result = post.Images.map(img => {
            return { path:"upload/"+img.filename , filename:img.filename,id:img.id}
        })

        dispatch(postAction.setSaveFileList(result));
    };

    const removePost = useCallback(() => {
        const data = {
            postId:post.id,
        }
        dispatch(postAction.removePostRequest(data))
    }, [])

    const retweet = useCallback(() => {
        const data = {
            postId: post.id
        }
        dispatch(postAction.retweetRequest(data))
    }, [])

    const modalInputVal = modalInput.value;
    
    const handleOk = useCallback(() => {
        const data = {
            postId:post.id,
            content: modalInputVal,
        }
        dispatch(postAction.updatePostRequest(data))
        modalRef.current.setIsModalOpen(false);
    }, [modalInputVal])

    return (
        <CardWrapper>
            <Global/>
            <Card
                title={post.Retweet ? post.User.nickname+'님이 리트윗 하셨습니다.' : ''}
                extra={id && <FollowButton followings={followings} post={post} />}
                cover={post.Images && post.Images[0] ? <PostImages images={post.Images} /> : ''}
                actions={[
                    <RetweetOutlined onClick={retweet} className="antd_icon" key="retweet" />,
                    liked 
                    ? <HeartFilled style={{color:'red'}} onClick={onToggleLike} twoToneColor="#eb2f96" key="heart"/> 
                    : <HeartOutlined className="antd_icon" onClick={onToggleLike}/>,
                    <MessageOutlined className="antd_icon" onClick={openComment} key="message"/>,
                    <Popover 
                        key="ellipsis"
                        content={(
                        <Button.Group>
                          {id && post.User.id === id
                            ? (
                              <>
                                <Button onClick={showModal}>수정</Button>
                                <Button onClick={removePost} type="danger">삭제</Button>
                              </>
                            )
                            : <Button>신고</Button>}
                        </Button.Group>
                    )}>
                    <div>
                        <EllipsisOutlined/>,
                    </div>
                    </Popover>,
                ]}>
                {
                    post.Retweet ? 
                    <Card
                        cover={post.Retweet.Images && post.Retweet.Images[0] ? <PostImages images={post.Retweet.Images} /> : ''}
                    >
                        <Card.Meta
                            avatar={ <DropdownAvatar user={post.Retweet.User}/> }
                            title={post.Retweet.User.nickname}
                            description={<PostCardContent postData={post.Retweet.content} />}
                        />
                    </Card>
                    :
                    <Card.Meta
                        avatar={ <DropdownAvatar user={post.User}/> }
                        title={post.User.nickname}
                        description={<PostCardContent postData={post.content} />}
                    />
                }
                
            </Card>
            {comment 
            ? 
            <>
                <CommentForm post={post}/>
                <List
                    header={`${post.Comments ? post.Comments.length : 0}개의 댓글`}
                    dataSource={post.Comments}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={ <DropdownAvatar user={item.User}/> }
                                title={item.User.nickname}
                                description={
                                    <div dangerouslySetInnerHTML={{__html:item.content}}></div>
                                    // <Comment 
                                    //     content={item.content}
                                    // />
                                }
                            />
                        </List.Item>
                    
                    )}
                />
            </>
            : null
            }

            <PostForm isUpdate={true} modalRef={modalRef} propsValue={modalInput.value} propsOnChange={modalInput.onChange} post={post}/>


        </CardWrapper>
    )
}

export default PostCard;