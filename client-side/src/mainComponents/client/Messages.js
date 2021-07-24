import React from 'react'

export default function Messages({messages}) {
    return (

        <div className="messages-group">
            { (messages.length >= 1) ? messages.map( (data) => {
                return <div className="me" key={data.id}>
                    <div>
                        {(data.seen === true) ?
                            <i className="fas fa-check-double check-active"/>
                        : (data.reach === true) ?
                            <i className="fas fa-check-double" />
                        : (data.sent === true) ?
                            <i className="fas fa-check" />
                        : ''
                        }
                    </div>
                    <p>
                        {data.mssg}
                    </p>
                    </div>
            }) : ''}
        </div>
    )
}
