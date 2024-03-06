

const SocialKakao = () => {
    const url = process.env.NEXT_PUBLIC_NODE_SERVER;
    return(
        <>
            <a id="kakao" href={`${url}/user/social/kakao/login`} className="kakao_img"></a>
        </>
    )
}

export default SocialKakao; 
