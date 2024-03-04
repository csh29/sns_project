import { useState } from 'react';

const UseInput = (initialValue = '') => {
    const [value,setValue] = useState(initialValue)

    const onChange = (e) => {
        setValue(e.target.value)
    }

    return {value,onChange,setValue};
}

export default UseInput;