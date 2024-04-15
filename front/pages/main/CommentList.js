import { useCallback } from "react";
import { postAction } from "../../reducers/post";
import { List, Popconfirm } from "antd";
import { CloseOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";


const CommentList = ({DropdownAvatar,post}) => {
    const id = useSelector((state) => state.user.user.id);
    const dispatch = useDispatch();

    const deleteComment = useCallback((item) => {
        return new Promise(resolve => {
            const data = {
                id: item.id,
                PostId: item.PostId,
                resolve
            }
            dispatch(postAction.removeCommentRequest(data));
          });
    },[])
    
    return (
        <List
                    className='comment-container'
                    dataSource={post.Comments}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={ <DropdownAvatar user={item.User}/> }
                                title={item.User.nickname}
                                description={
                                    <div dangerouslySetInnerHTML={{__html:item.content}}></div>
                                }
                            />
                            {
                                item.UserId === id && (
                                    <Popconfirm
                                        title="해당 댓글을 삭제 하시겠습니까?"
                                        okText="삭제"
                                        cancelText="취소"
                                        onConfirm={() => deleteComment(item)} 
                                        icon={<QuestionCircleOutlined style={{ color: 'red' }}/>}
                                    >
                                        <CloseOutlined />
                                    </Popconfirm>
                                )
                            }
                            
                        </List.Item>
                    
                    )}
        />
    )
}

export default CommentList;