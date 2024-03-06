import {  Input , Modal , Dropdown , Space } from 'antd';
import Link from 'next/link';
import { useCallback, useState, useImperativeHandle , forwardRef, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { userAction } from '../../reducers/user';
import { CloseCircleFilled } from '@ant-design/icons';
import {useDropzone} from 'react-dropzone';
import { postAction } from '../../reducers/post';
import ProgressBar from 'react-bootstrap/ProgressBar';

const InputWrapper = styled(Input)`
    width: 59%;
    margin-bottom: 5px;
`

const LabelWrapper = styled.label`
  color: var(--color-primary) !important;
  transition: color 0.3s ease;
`

const ContextMenu = ({children,user,followings}) => {
    const dispatch = useDispatch();
    const findUser = followings.find(v => v.id === user.id);
    
    const follow = useCallback(() => {
        
        const data = {
            targetId : user.id,
            type: findUser ? 'unFollow' : 'follow'
        }
        dispatch(userAction.followRequest(data))
    },[])

    const items = [
        {
          label: <Link href={`/userinfo/${user.id}`}><div>게시글 보기</div></Link>,
          key: '0',
        },
        {
            type: 'divider',
        },
        {
          label: <div onClick={follow}> {findUser ? '언팔로우' : '팔로우'} </div>,
          key: '1',
        },
        
      ];

    const { id : me } = useSelector((state) => state.user.user)
    if(me === user.id) {
        items.pop()
    }

    return (
        <Dropdown menu={{ items }} trigger={['click']}>
            <Space>
                {children}
            </Space>
        </Dropdown>
    )
}

const TextComponent = ({data , name}) => {
    const { value , onChange } = data;
    return (
        <>
            <LabelWrapper>{name}</LabelWrapper>
            <br/>
            <InputWrapper
                value={value}
                onChange={onChange}
                name={name}
            />
            <br/>
        </>
    )
}


const ModalComponent = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        setIsModalOpen
      }))

      
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCancel = useCallback(() => {
        setIsModalOpen(false);
    },[]);
    

    return (
        <Modal 
            title={props.title}
            open={isModalOpen} 
            onOk={props.handleOk} 
            onCancel={props.handleCancel ? props.handleCancel : handleCancel}
            okButtonProps={props.isLoading ? {disabled: true} : null}>
            {props.children}
        </Modal>
    )
});
  

const FileUploader = ({removeImage}) => {
    const dispatch = useDispatch();
    const removeFileListLoading = useSelector((state) => state.post.removeFileListLoading);
    const [files, setFiles] = useState([]);
    const [per, setPer] = useState(0);
    const { saveFileList } = useSelector((state) => state.post);
    const baseURL = process.env.NEXT_PUBLIC_NODE_SERVER;
  
    const {getRootProps, getInputProps} = useDropzone({
      accept: {
        'image/*': []
      },
  
      onDrop: async acceptedFiles => {
        await new Promise((resolve, reject) => {
          const result =acceptedFiles.map(file => Object.assign(file, {
            isNew:true
          }))
          setFiles((prev) => prev.concat(...result))
          resolve(result)
        }).then(v => {
          const data = {setPer}
          const formData = new FormData()
          v.forEach(file => {
            formData.append("file",file);
          })
          data.formData = formData;
          dispatch(postAction.addPostImageRequest(data));
        });
      }
    });
  
    
    const ProcessBar = ({per,setPer}) => {
      if(per !== 0) {
        if(per === 100) {
          setTimeout(function() {
            setPer(0)
          },500)
        }
        return (
          <> <ProgressBar now={per}/> {per}% </>
        )
      } 
    }
    
    const thumbs = saveFileList.map(file => (
      <div key={file.path}>
      <CloseCircleFilled className='close-btn' onClick={() => removeImage(file.filename)} />
        <div className='thumb' key={file.path}>
          <div className='thumb-inner'>
            <img
              src={baseURL+"/"+file.path}
              className='thumb-inner-img'
            />
          </div>
        </div>
      </div>
    ));
  
    useEffect(() => {
      if(removeFileListLoading) {
        setFiles([])
        setPer(0);
      }
    }, [removeFileListLoading])
  
      return (
        <>
            <section className='container'>
              <div style={{marginTop:"5px"}} {...getRootProps({className: 'dropzone'})}>
                <input {...getInputProps()} />
                <p style={{color:'#bdbdbd',height:'80px',paddingTop:'27px'}}>Drag 'n' drop some files here, or click to select files</p>
              </div>
              <aside className='thumbs-container'>
                {thumbs}
              </aside>
            </section>
  
            <ProcessBar per={per} setPer={setPer}/>
        </>
      )
  }

export {ModalComponent,TextComponent,ContextMenu,FileUploader};