import React from 'react'
import { ProgressBar } from 'react-loader-spinner'
import './Loading.css'
const Loading = () => {
    return (
        <div className='loadingPage'>
            <ProgressBar
                height="100"
                width="50"
                ariaLabel="progress-bar-loading"
                wrapperStyle={{}}
                wrapperClass="progress-bar-wrapper"
                borderColor='#00000026'
                barColor='#008cff'
                // wrapperClassName="progress-bar"
            />
        </div>
    )
}

export default Loading