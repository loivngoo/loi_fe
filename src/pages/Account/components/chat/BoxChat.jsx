import { FileImageOutlined } from '@ant-design/icons';
import { Image, Input, Spin, notification } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import socket from '../../../../utils/socket';
import { ChatWrapper } from './styles';

import AppUsers from '@src/services/AppUsers';
import Message from './Message';

function BoxChat({ service }) {
    const boxChatRef = useRef(null);
    const user = sessionStorage.getItem('user_id');
    const [message, setMessage] = useState('');
    const [waiting, setWaiting] = useState(false);
    const [conversation, setConversation] = useState(null);
    const [previewImg, setPreviewImg] = useState(null);
    const [messages, setMessages] = useState([
        {
            _id: '1',
            content: 'Chào bạn tôi có thể giúp được gì cho bạn ?',
            sender: 'admin',
        },
    ]);

    const scrollToBottom = () => {
        let el = document.querySelector('.box__body');
        if (el) {
            el.scrollTop = el.scrollHeight || el.clientHeight;
        }
    };

    const handleSendMessage = async () => {
        let data = {
            content: message,
            user: user,
            conversation_id: conversation,
        };
        const file = document.querySelector('#file').files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            // const response_file = await AppUsers.UploadFile(formData);
            // Xử lý hình ảnh
            data.image = 'https://cdn-icons-png.flaticon.com/512/190/190119.png';
        }

        const response = await AppUsers.CreateMessage(data);
        if (response.status_code === 200) {
            setMessages((prev) => [...prev, response.data]);
            scrollToBottom();
            setMessage('');
            setPreviewImg(null);
            document.querySelector('#file').value = '';
            socket.emit('chat::sendMessage', response.data);
        }
    };

    const autoCreateTicket = async () => {
        const data = {
            service: service,
            user: user,
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

    const handleSelectImage = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setPreviewImg(reader.result);
        };
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
            if (data === `${service} - ${user}`) {
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
                    <div className="preview mb-3 text-right">
                        {previewImg && <Image width={200} height={300} src={previewImg} alt="" />}
                    </div>
                    <div className="box__footer">
                        <div className="box__footer--image">
                            <input
                                id="file"
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={(e) => {
                                    handleSelectImage(e);
                                }}
                            />
                            <div
                                onClick={() => {
                                    document.getElementById('file').click();
                                }}
                                className="bg-[#1989fa] p-3 text-center border-[1px] border-[#2196f3]"
                            >
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
