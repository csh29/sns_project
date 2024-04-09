import InfiniteScroll from 'react-infinite-scroll-component';
import { Avatar, Divider, List, Skeleton } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';


const DivWrapper = styled.div`
    height: 200px;
    overflow: auto;
    border: 1px solid rgba(140, 140, 140, 0.35);
`

const ListDivWrapper = styled.div`
    cursor:pointer;
    padding:0 16px;
`


const MentionList = ({text,setMention}) => {
    const [data, setData] = useState([]);
    const { user } = useSelector((state) => state.user);
    const container = useRef();
    const listDivRef = useRef();

    
    useEffect(() => {
        const list = user.Followings.filter(follow => findWord(text,follow.nickname))
        setData(list)
    },[user,text])
    

    const clickMentionList = useCallback((e) => {
        const email = e.currentTarget.getAttribute('data-email')
        const nickname = e.currentTarget.getAttribute('data-nickname')
        setMention({email,nickname})
    },[])


    const findWord = useCallback((search, targetWord) => {
        if(search.trim() === ''){
            return true;
        }
        const CHO_HANGUL = [
            'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ',
            'ㄹ', 'ㅁ', 'ㅂ','ㅃ', 'ㅅ',
            'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ',
            'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
          ];
          
          const HANGUL_START_CHARCODE = "가".charCodeAt();
          
          const CHO_PERIOD = Math.floor("까".charCodeAt() - "가".charCodeAt());
          const JUNG_PERIOD = Math.floor("개".charCodeAt() - "가".charCodeAt());
          
          const combine = (cho, jung, jong) => {
            return String.fromCharCode(
              HANGUL_START_CHARCODE + cho * CHO_PERIOD + jung * JUNG_PERIOD + jong
            );
          }
          
          const makeRegexByCho = (search = "") => {
            const regex = CHO_HANGUL.reduce(
              (acc, cho, index) =>
                acc.replace(
                  new RegExp(cho, "g"),
                  `[${combine(index, 0, 0)}-${combine(index + 1, 0, -1)}]`
                ),
              search
            );
          
            return new RegExp(`(${regex})`, "g");
          }
          
          const includeByCho = (search, targetWord) => {
            return makeRegexByCho(search).test(targetWord);
          }

          return includeByCho(search, targetWord)
    },[])
    return (
        <DivWrapper id="scrollableDiv" ref={container} >
        
                <List
                    dataSource={data}
                    renderItem={(item,index) => (
                        <ListDivWrapper 
                            className={index===0 ? 'mention-list-hover' : ''} 
                            id="listDivWrapper" 
                            onClick={clickMentionList} 
                            tabIndex={0} 
                            ref={listDivRef}
                            data-email={item.email}
                            data-nickname={item.nickname}
                        >
                            <List.Item key={item.email}>
                            {
                                item.profileImageUrl
                                ? <Avatar src={item.profileImageUrl} style={{marginRight:'10px'}}></Avatar>
                                : <Avatar style={{marginRight:'10px'}}>{item.nickname[0]}</Avatar>
                            }
                            <List.Item.Meta
                                description={item.nickname}
                            />
                            </List.Item>
                        </ListDivWrapper>
                    )}
                />
        </DivWrapper>
    )
}

export default MentionList;