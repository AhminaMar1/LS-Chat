import React from 'react'
import '../../../styles/wait.scss'
import waitGif from '../../../img/wait.gif'

export default function Wait() {
    return (
        <div className="container-wait">

            <img src={waitGif} alt="Wait gif" />
            <b>Please wait</b>
        </div>
    )
}
