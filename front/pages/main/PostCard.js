import { Card, Button, Avatar, Popover, Col, Row} from 'antd';
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
import { ModalComponent } from '../components/Component'
import CommentList from './CommentList';

const CardWrapper = styled.div`
  margin-bottom: 20px;

`;

export const Global = createGlobalStyle`
  .ant-card-head {
    border-bottom: 2px solid #f0f0f0;
  }
`
const CardMetaWrapper = styled(Card.Meta)`
    margin-top:50px;
    font-weight:bold;
    cursor:pointer;
`
const PostCard = ({post , followings}) => {
    const modalRef = useRef();
    const likeModalRef = useRef();
    const dispatch = useDispatch();
    const [ comment , setOpenComment ] = useState(false);
    const id = useSelector((state) => state.user.user.id);
    const liked = post.Likers?.find((v) => v.id === id);
    
    const LikeList = useCallback(({like}) => {
        const targetId = like.id;
        return (
                <Row gutter={[16, 16]} style={{paddingBottom:'30px'}}>
                    <Col span={18} >
                        <Card.Meta
                            avatar={ 
                                like.profileImageUrl ? 
                                <Avatar src={like.profileImageUrl}></Avatar>
                                :
                                <Avatar>{like.nickname[0]}</Avatar>
                            }
                            description={like.nickname}
                        />
                    </Col>
                    <Col>
                        <FollowButton followings={followings} targetId={targetId} />
                    </Col>
                </Row>
            
        )
    },[followings])

    const handleCancel = useCallback(() => {
        likeModalRef.current.setIsModalOpen(false);
    },[]);
    

    const openLikeList = useCallback(() => {
        likeModalRef.current.setIsModalOpen(true);
    }, [])

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


    return (
        <CardWrapper>
            <Global/>
            <Card
                title={post.Retweet ? post.User.nickname+'님이 리트윗 하셨습니다.' : ''}
                extra={id && <FollowButton followings={followings} targetId={post.User.id} />}
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
                {
                    post.Likers.length > 0 ?
                    (
                        <>
                            <div style={{display:'flex',justifyContent:'flex-start'}}>
                                <CardMetaWrapper
                                    style={{marginRight:'auto'}}
                                    description={`좋아요 ${post.Likers.length}`}
                                    onClick={openLikeList}
                                />
                                    <CardMetaWrapper
                                        description={`${post.Comments ? post.Comments.length : 0}개의 댓글`}
                                    />
                            </div>
                            <ModalComponent
                                title="좋아요"
                                ref={likeModalRef}
                                footer={[<Button key={post.id} onClick={handleCancel}>닫기</Button>]}
                            >
                                { post.Likers.map(like => <LikeList key={like.id} like={like}/>) }
                            </ModalComponent>
                        </>
                    )
                   :
                   null
                }
                
            </Card>
            {comment 
            ? 
            <>
                <CommentForm post={post}/>
                <CommentList DropdownAvatar={DropdownAvatar} post={post}/>
            </>
            : null
            }

            <PostForm isUpdate={true} modalRef={modalRef} propsValue={modalInput.value} propsOnChange={modalInput.onChange} post={post}/>


        </CardWrapper>
    )
}

export default PostCard;