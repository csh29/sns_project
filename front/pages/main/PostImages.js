import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import PostImageZoom from './ImagesZoom';

const PlusOutlinedWrapper = styled.div`
    display: inline-block;
    text-align: center;
    width: 50%;
`

const DivWrapper = styled.div`
    cursor: pointer;
`

const PostImages = ({images}) => {
    const baseURL = process.env.NEXT_PUBLIC_NODE_SERVER;
    const [ zoom , setZoom ] = useState(false);
    const imglen = images.length 

    const onZoom = () => {
        setZoom((prev) => !prev);
    }
    const onClose = () => {
        setZoom(false);
    }

    if( imglen === 1) {
        return (
            <DivWrapper>
                <img role="presentation" width={"100%"} src={baseURL+images[0].src} alt={images[0].src} onClick={onZoom} />
                {zoom ? <PostImageZoom onClose={onClose} images={images}/> : null }
            </DivWrapper>
        )
    } else {
        return (
            <DivWrapper>
                <img role="presentation" height={"400px"} width={"50%"} style={{marginLeft:'1px', marginRight:'-1px'}} src={baseURL+images[0].src} alt={images[0].src} onClick={onZoom} />
                
                    { imglen > 2 
                    ?   
                        <PlusOutlinedWrapper onClick={onZoom}>
                            <PlusOutlined/>
                            <br/>
                            {imglen-1}개의 사진 더보기
                        </PlusOutlinedWrapper> 
                    : 
                    <img role="presentation" height={"400px"} width={"50%"} src={baseURL+images[1].src} alt={images[1].src} onClick={onZoom} />
                    }
                {
                    zoom 
                    ? <PostImageZoom onClose={onClose} images={images}/> 
                    : null 
                }
            </DivWrapper>
        )
    }
    
}


export default PostImages;