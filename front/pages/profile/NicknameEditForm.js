import { Input } from 'antd';
import { FormWrapper } from './ProfileStyle'
import { useCallback } from 'react';
import UseInput from '../components/UseInput';
import {userAction} from '../../reducers/user';
import { useDispatch, useSelector } from 'react-redux';

const NicknameEditForm = () => {
    const dispatch = useDispatch();
    const nicknameInput = UseInput('');
    const value = nicknameInput.value
    const updateNicknameLoading = useSelector((state) => state.user.updateNicknameLoading);

    const onSubmit = useCallback(() => {
        dispatch(userAction.updateNicknameRequest({nickname:value}));
    },[value])

    return (
        <FormWrapper >
            <Input.Search 
                loading={updateNicknameLoading} 
                addonBefore="닉네임" 
                enterButton="수정" 
                onChange={nicknameInput.onChange} 
                value={nicknameInput.value}
                onSearch={onSubmit}
            />
        </FormWrapper> 
    )
}

export default NicknameEditForm;