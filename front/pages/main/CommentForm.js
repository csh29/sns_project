import { Button, Form, Input, notification } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postAction } from '../../reducers/post';
import { notiAction } from '../../reducers/notification';
import MentionList from './MentionList';
import styled from 'styled-components';


const DivInput = styled.div`
  height:95px;
  overflow-y:scroll;
  &:hover {
    border-color: #40a9ff;
    border-right-width: 1px;
  }
`
const CommentForm = ({post}) => {
    const dispatch = useDispatch();
    const { id:userId , nickname } = useSelector((state) => state.user.user);
    const { addCommentLoading , addCommentDone } = useSelector((state) => state.post);
    const [mentionLoading,setMentionLoading] = useState(false);
    const [mentionWord,setMentionWord] = useState('')
    const textAreaRef = useRef();
    
    const enterBlock = useCallback((e) => {
      if(e.keyCode === 13) {
        e.preventDefault()
      }
    },[])
    
    const initSpan = () => {
      if(textAreaRef.current.children.length === 0) {
        const node = createSpanTag('comment-text')
        node.innerHTML = '&nbsp;'
        nextCursor()
      }
    }

    const onSubmitComment = useCallback(() => {
        const emails = []
        const nodes = document.querySelectorAll('.ant-input > span[data-email]')
        nodes.forEach(node => emails.push(node.getAttribute('data-email')))

        const data = { content:textAreaRef.current.innerHTML, userId: userId, postId: post.id ,nickname:nickname , emails}
        dispatch(postAction.addCommentRequest(data))
        dispatch(notiAction.addNotificationRequest(data))
        textAreaRef.current.innerHTML = ''
        setMentionLoading(false);
      }, []);
    
      useEffect(() => {
        if (addCommentDone) {

        }
       
      }, [addCommentDone]);

      const listKeydown = (e) => {
        if(!mentionLoading) return false;
        const className = "mention-list-hover";
        const node = document.querySelector(`.${className}`)
        e.preventDefault();
        if(e.keyCode === 40) {
            if(!node.nextElementSibling) return false;

            node.classList.remove(className);
            node.nextElementSibling.classList.add(className)
            node.nextElementSibling.focus()
        } else if(e.keyCode === 38) {
            if(!node.previousSibling) return false;
            
            node.classList.remove(className);
            node.previousSibling.classList.add(className)
            node.previousSibling.focus()
        } else if(e.keyCode === 13 ){
          setMention({nickname:node.getAttribute('data-nickname')});
        }
        textAreaRef.current.focus()
    }

      const onChangeCommentText = useCallback((e) => {
        if(textAreaRef.current.children[0]?.outerHTML === '<br>') {
          textAreaRef.current.children[0].remove()
          const node = createSpanTag('comment-text')
          node.innerHTML = '&nbsp;'
          nextCursor()
        }
        
        const reg = /\s@|^@/;
        listKeydown(e);

        const selection = window.getSelection()
        const currentNode = selection.getRangeAt(0).startContainer.parentNode;
        const textValue = currentNode.innerText;

        if(e.key.length === 1) {
          if(textValue.match(reg)) {
            if(!mentionLoading && currentNode.className !== 'close-mention-editor' && currentNode.className !== 'color-ignore comment-editor mention') {
              currentNode.innerText = currentNode.innerText.replace('@',"");
              const node = createSpanTag('mention');
              node.innerText = '@'
              nextCursor(node)
            } else if(currentNode.className === 'close-mention-editor') {
              currentNode.classList.remove('close-mention-editor')
              currentNode.classList.add('color-ignore','comment-editor','mention');
            }

            setMentionWord(textValue.split(reg)[1]);
  
            setMentionLoading(true);
          }
        } else if(e.key === 'Backspace') {
          if(textValue.match(reg)) {
            setMentionWord(textValue.split(reg)[1]);
            setMentionLoading(true);
            currentNode.classList.add('mention');
          } else {
            setMentionLoading(false);
            nextCursor(currentNode);
          }
        } else if(e.key === 'Escape') {
          const cursorNode = selection.getRangeAt(0).startContainer;
          
          setMentionLoading(false);

          if(cursorNode?.className?.indexOf('DivInput') !== -1) {
            return false;
          }

          if(cursorNode.className) {
            cursorNode.className = 'close-mention-editor'
          } else {
            cursorNode.parentNode.className = 'close-mention-editor'
          }
          
          
        }

      }, [mentionLoading]);

      const createSpanTag = (type) => {
        const span = document.createElement("span");
        if(type === 'mention') {
          span.classList.add('color-ignore','comment-editor',type);
        } else {
          span.classList.add(type);
        }
        textAreaRef.current.appendChild(span)
        return span;
      }

      const nextCursor = (node = textAreaRef.current) => {
        const range = document.createRange();
        range.selectNodeContents(node);
        range.collapse(false);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
      
      const setMention = useCallback((data) => {
        const node = document.querySelector('.mention');
        node.innerText = '@'+data.nickname;
        node.setAttribute('data-email',data.email);
        node.classList.remove('mention');

        const nextSpan = document.createElement("span")
        nextSpan.innerHTML= '&nbsp;'
        textAreaRef.current.appendChild(nextSpan)
        nextCursor()

        setMentionLoading(false);
      },[])

    return(
        <>
            { mentionLoading ? <MentionList text={mentionWord} setMention={setMention} /> : null}

            <Form onFinish={onSubmitComment}>
                <Form.Item style={{ position: 'relative', margin: 0 }}>
                    <DivInput className='ant-input' contentEditable='true' onClick={initSpan} onKeyDown={enterBlock} onKeyUp={onChangeCommentText} ref={textAreaRef}>
                    </DivInput>
                    
                    <Button loading={addCommentLoading} style={{ position: 'absolute', right: 0, bottom: -40, zIndex:1 }} type="primary" htmlType="submit">등록</Button>
                </Form.Item>
            </Form>
            
        </>
    )
}

export default CommentForm;