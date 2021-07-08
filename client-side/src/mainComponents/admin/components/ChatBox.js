import React from 'react';
import '../../../styles/admin.scss';

export default function ChatBox() {
    return (
        <div className="flex-chat-box" id="chat-display">
            <div className="chat-container">
                <div className="chat-msg">
                    <p className="chat-msg-me">
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit
                    </p>
                </div>

                <div className="chat-msg">
                    <p className="chat-msg-user">
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aut quidem, saepe veniam iure quas error possimus expedita ipsa nostrum minima?
                    </p>
                </div>

                <div className="chat-msg">
                    <p className="chat-msg-me">
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit
                    </p>
                </div>

                <div className="chat-msg">
                    <p className="chat-msg-user">
                        Lorem ipsum dolor sit amet consectetur.
                    </p>
                </div>

                <div className="chat-msg">
                    <p className="chat-msg-user">
                        Okay
                    </p>
                </div>

                <div className="chat-msg">
                    <p className="chat-msg-me">
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit
                    </p>
                </div>

                <div className="chat-msg">
                    <p className="chat-msg-user">
                        Lorem, ipsum.
                    </p>
                </div>

                <div className="chat-msg">
                    <p className="chat-msg-me">
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit
                    </p>
                </div>
                
                <div className="chat-msg">
                    <p className="chat-msg-me">
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit
                    </p>
                </div>

                <div className="chat-msg">
                    <p className="chat-msg-user">
                        Okay
                    </p>
                </div>

                <div className="chat-msg">
                    <p className="chat-msg-user">
                        Lorem, ipsum.
                    </p>
                </div>

                <div className="chat-msg">
                    <p className="chat-msg-user">
                        Okay
                    </p>
                </div>
                
                <form>
                    <div className="input-chat-box-flex">
                        <div className="input-chat-box">
                            <div className="button-group">
                                <button>Send</button>
                            </div>
                            <textarea type="text"></textarea>
                        </div>
                    </div>
                </form>
                    
            </div>
            
        </div>
    )
}
