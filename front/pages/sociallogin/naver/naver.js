

const SocialNaver = () => {
    const url = process.env.NEXT_PUBLIC_NODE_SERVER;

    return (
        <>
            <a id="naver" href={`${url}/user/social/naver/login`} className="naver_img" ></a>
        </>
    )
}

export default SocialNaver;