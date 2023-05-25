import { FileImageOutlined } from '@ant-design/icons';
import { Input, Spin, notification } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import socket from '../../../../../utils/socket';
import { ChatWrapper } from './styles';

import AppUsers from '@src/services/AppUsers';
import Message from './Message';

function BoxChat({ service }) {
    const boxChatRef = useRef(null);
    const user = JSON.parse(localStorage.getItem('user'));
    const [message, setMessage] = useState('');
    const [waiting, setWaiting] = useState(false);
    const [conversation, setConversation] = useState(null);
    const [messages, setMessages] = useState([
        {
            _id: '1',
            content: 'Chào bạn tôi có thể giúp được gì cho bạn ?',
            sender: 'admin',
        },
    ]);

    const scrollToBottom = () => {
        let el = document.querySelector('.box__body');
        el.scrollTop = el?.scrollHeight;
    };

    const handleSendMessage = async () => {
        if (!message) return;
        const data = {
            content: message,
            user: `USER - ${user.phone}`,
            image: '',
            conversation_id: conversation,
        };
        const response = await AppUsers.CreateMessage(data);
        if (response.status_code === 200) {
            setMessages((prev) => [...prev, response.data]);
            scrollToBottom();
            setMessage('');
            socket.emit('chat::sendMessage', response.data);
        }
    };

    const autoCreateTicket = async () => {
        const data = {
            service: service,
            user: `USER - ${user.phone}`,
        };
        const response = await AppUsers.CreateTicket(data);
        if (response.status_code === 99) {
            setConversation(response.data);
            const data_send = {
                conversation_id: response.data,
            };
            const response_mes = await AppUsers.GetListMessage(data_send);
            if (response_mes.status_code === 200) {
                setMessages(response_mes.data);
                scrollToBottom();
            }
        } else if (response.status_code === 200) {
            setConversation(response.data.conversation_id);
            setWaiting(true);
        } else {
            setWaiting(false);
            notification.error({
                message: 'Lỗi',
                description: 'Có lỗi xảy ra vui lòng thử lại',
            });
        }
    };

    useEffect(() => {
        scrollToBottom();
        socket.on('chat::receivedMessage', (data) => {
            if (conversation === data.conversation_id) {
                setMessages((prev) => [...prev, data]);
            }
        });

        return () => {
            socket.off('chat::receivedMessage');
        };
    }, [messages]);

    useEffect(() => {
        socket.on('Support::JOINED', (data) => {
            console.log(data, 'JOINED');
            if (data === `${service} - USER - ${user.phone}`) {
                setWaiting(false);
            }
        });
    }, [waiting]);

    useEffect(() => {
        autoCreateTicket();
    }, []);

    return (
        <ChatWrapper>
            {waiting ? (
                <div className="box__waiting">
                    <div className="box__waiting--content">
                        <div className="box__waiting--content__title">
                            Xin lỗi mọi nhân viên hỗ trợ hiện nay đều đang bận{' '}
                        </div>

                        <div className="loading">
                            <Spin />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="box">
                    <div className="box__body" ref={boxChatRef}>
                        <div className="box__body--items">
                            {messages.map((message, index) => (
                                <Message message={message} user={user} key={index} />
                            ))}
                        </div>
                    </div>
                    <div className="box__footer">
                        <div className="box__footer--image">
                            <div className="bg-[#1989fa] p-3 text-center border-[1px] border-[#2196f3]">
                                <FileImageOutlined
                                    style={{
                                        color: '#fff',
                                        fontSize: '20px',
                                        cursor: 'pointer',
                                    }}
                                    size={20}
                                />
                            </div>
                        </div>
                        <div className="box__footer--input">
                            <Input.TextArea
                                cols={1}
                                rows={2}
                                type="text"
                                placeholder="Nhập tin nhắn"
                                value={message}
                                onChange={(e) => {
                                    setMessage(e.target.value);
                                }}
                                onPressEnter={() => handleSendMessage()}
                            />
                        </div>
                        <div className="box__footer--button">
                            <div
                                className="bg-[#1989fa] p-3  text-center border-[1px] border-[#2196f3]"
                                onClick={() => handleSendMessage()}
                            >
                                <span className="text-white text-sm">Gửi</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </ChatWrapper>
    );
}

export default BoxChat;
