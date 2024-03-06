import { useEffect, useState } from 'react';
import { CloseCircleFilled } from '@ant-design/icons';

import {useDropzone} from 'react-dropzone';
import { postAction } from '../../reducers/post';
import { useDispatch, useSelector } from 'react-redux';
import ProgressBar from 'react-bootstrap/ProgressBar';


const closeBtn = {
  position:'relative',
  cursor:'pointer',
  bottom: '75%',
  left: '3%',
}
const thumbsContainer = {
  height: "110px",
  overflowY: 'scroll',
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16,
  
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 120,
  height: 100,
  padding: 4,
  boxSizing: 'border-box',
  minWidth: 0,
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};

function ProcessBar({per,setPer}) {
  
  if(per !== 0) {
    if(per === 100) {
      setTimeout(function() {
        setPer(0)
      },500)
    }
      
    return (
      <>
        <ProgressBar now={per}/>
        {per}%
      </>
    )
  } 
  
}


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
        const data = {}
        const formData = new FormData()
        v.forEach(file => {
          formData.append("file",file);
        })
        data.formData = formData;
        data.setPer = setPer;
        dispatch(postAction.addPostImageRequest(data));
      });
    }
  });
  
  const thumbs = saveFileList.map(file => (
    <div key={file.path}>
    <CloseCircleFilled style={closeBtn} onClick={() => removeImage(file.filename)} />
      <div style={thumb} key={file.path}>
        
        <div style={thumbInner}>
          <img
            src={baseURL+"/"+file.path}
            style={img}
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
            <aside style={thumbsContainer}>
              {thumbs}
            </aside>
          </section>

          <ProcessBar per={per} setPer={setPer}/>
      </>
    )
}

export default FileUploader;