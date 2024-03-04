import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';


const HashtagWrapper = styled.a`
    font-weight: bold;
    color: #1890ff !important;

`
const PostCardContent = ({postData}) => {

    return (
        <div>
            {postData.split(/(#[^\s#]+)/g).map((v , i) => {
            v = v.replace(/(?:\r\n|\r|\n)/g, '<br/>');
            if (v.match(/(#[^\s#]+)/)) {
                return (
                    <Link
                        href={{ pathname: '/hashtag', query: { tag: v.slice(1) } }}
                        as={`/hashtag/${v.slice(1)}`}
                        key={i}

                    >
                        <HashtagWrapper >{v}</HashtagWrapper>
                    </Link>
                );
            }
            const data = v.split("<br/>").map((line) => {
                return (
                    <span key={Math.random()}>
                        {line}
                        <br />
                    </span>
                );
            })
            return data;

            })}
        </div>
    )
}

export default PostCardContent;