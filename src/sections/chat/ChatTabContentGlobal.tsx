import { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; // 如果项目中没有uuid库，需要先安装
import { EmojiPicker } from './EmojiPicker'; // 导入表情选择器组件
import { useAuth } from '@/contexts/auth';

// 消息类型定义
type MessageType = 'text' | 'image' | 'gif' | 'sticker';

// 消息数据结构
interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  contentType: MessageType;
  timestamp: number;
}

// 消息分组结构
interface MessageGroup {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  messages: {
    id: string;
    content: string;
    contentType: MessageType;
    timestamp: number;
  }[];
  isCurrentUser: boolean;
}

// 时间分隔结构
interface TimeBreak {
  id: string;
  timestamp: number;
  text: string;
}

// 模拟初始消息数据
const initialMessages: ChatMessage[] = [
  {
    id: '1',
    senderId: 'user1',
    senderName: 'Bob',
    senderAvatar: 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp',
    content: '/images/stickers/1.gif',
    contentType: 'gif',
    timestamp: Date.now() - 3600000, // 1小时前
  },
  {
    id: '2',
    senderId: 'user1',
    senderName: 'Bob',
    senderAvatar: 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp',
    content: 'It was said that you would, destroy the Sith, not join them.',
    contentType: 'text',
    timestamp: Date.now() - 3590000, // 59分50秒前
  },
  {
    id: '3',
    senderId: 'user2',
    senderName: 'Alice',
    senderAvatar: 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp',
    content: 'Hello there!',
    contentType: 'text',
    timestamp: Date.now() - 1800000, // 30分钟前
  },
  {
    id: '4',
    senderId: 'user2',
    senderName: 'Alice',
    senderAvatar: 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp',
    content: 'How are you doing today?',
    contentType: 'text',
    timestamp: Date.now() - 1790000, // 29分50秒前
  },
  {
    id: '5',
    senderId: 'current-user',
    senderName: 'Anakin',
    senderAvatar: 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp',
    content: "I'm good, thanks!",
    contentType: 'text',
    timestamp: Date.now() - 600000, // 10分钟前
  },
  {
    id: '6',
    senderId: 'current-user',
    senderName: 'Anakin',
    senderAvatar: 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp',
    content: '/images/stickers/2.gif',
    contentType: 'gif',
    timestamp: Date.now() - 590000, // 9分50秒前
  },
];

// 时间间隔（毫秒）
const TIME_BREAK_THRESHOLD = 10 * 60 * 1000; // 10分钟
const MESSAGE_GROUP_THRESHOLD = 5 * 60 * 1000; // 5分钟

export const ChatTabContentGlobal = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [message, setMessage] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // 处理消息分组和时间分隔
  const processedMessages = (): (MessageGroup | TimeBreak)[] => {
    const result: (MessageGroup | TimeBreak)[] = [];
    let currentGroup: MessageGroup | null = null;
    let lastTimestamp = 0;

    // 对消息进行排序（按时间）
    const sortedMessages = [...messages].sort((a, b) => a.timestamp - b.timestamp);

    sortedMessages.forEach((msg) => {
      // 检查是否需要添加时间分隔
      if (lastTimestamp > 0 && msg.timestamp - lastTimestamp > TIME_BREAK_THRESHOLD) {
        result.push({
          id: `time-${msg.timestamp}`,
          timestamp: msg.timestamp,
          text: formatDateBreak(msg.timestamp),
        });
      }

      // 检查是否需要开始新的消息组
      const shouldStartNewGroup =
        !currentGroup ||
        currentGroup.senderId !== msg.senderId ||
        msg.timestamp - currentGroup.messages[currentGroup.messages.length - 1].timestamp > MESSAGE_GROUP_THRESHOLD;

      if (shouldStartNewGroup) {
        if (currentGroup) {
          result.push(currentGroup);
        }
        currentGroup = {
          id: `group-${msg.id}`,
          senderId: msg.senderId,
          senderName: msg.senderName,
          senderAvatar: msg.senderAvatar,
          messages: [
            {
              id: msg.id,
              content: msg.content,
              contentType: msg.contentType,
              timestamp: msg.timestamp,
            },
          ],
          isCurrentUser: user ? msg.senderId === String(user.id) : false,
        };
      } else if (currentGroup) {
        // 添加到当前组
        currentGroup.messages.push({
          id: msg.id,
          content: msg.content,
          contentType: msg.contentType,
          timestamp: msg.timestamp,
        });
      }

      lastTimestamp = msg.timestamp;
    });

    // 添加最后一个组
    if (currentGroup) {
      result.push(currentGroup);
    }

    return result;
  };

  // 发送消息处理函数
  const handleSendMessage = () => {
    if (message.trim() && user) {
      // 创建新消息对象，使用认证用户的信息
      const newMessage: ChatMessage = {
        id: uuidv4(),
        senderId: String(user.id),
        senderName: user.first_name || user.username || '',
        senderAvatar: user.avatar,
        content: message.trim(),
        contentType: 'text',
        timestamp: Date.now(),
      };

      // 更新消息列表
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // 清空输入框
      setMessage('');

      // 模拟发送到服务器
      // 实际项目中，这里会调用API发送消息
      console.log('Sending message to server:', newMessage);

      // 消息发送后滚动到底部
      setTimeout(scrollToBottom, 100);
    }
  };

  // 处理表情选择
  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji);
  };

  // 发送媒体内容（GIF或贴纸
  const handleSendMedia = (mediaUrl: string, type: MessageType = 'image') => {
    if (!user) return;

    const newMessage: ChatMessage = {
      id: uuidv4(),
      senderId: String(user.id),
      senderName: user.first_name || user.username || '',
      senderAvatar: user.avatar,
      content: mediaUrl,
      contentType: type,
      timestamp: Date.now(),
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setShowEmojiPicker(false); // 发送后关闭选择器
    setTimeout(scrollToBottom, 100);
  };

  // 滚动到底部
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  // 首次加载和消息更新时滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 点击其他区域关闭表情选择器
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const emojiPicker = document.getElementById('emoji-picker');
      const emojiButton = document.getElementById('emoji-button');

      if (
        emojiPicker &&
        !emojiPicker.contains(event.target as Node) &&
        emojiButton &&
        !emojiButton.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  // 格式化时间
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // 格式化日期分隔线
  const formatDateBreak = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    // 今天
    if (date.toDateString() === now.toDateString()) {
      return 'Today';
    }
    // 昨天
    else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    // 其他日期
    else {
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  // 渲染消息内容
  const renderMessageContent = (message: { content: string; contentType: MessageType }) => {
    switch (message.contentType) {
      case 'image':
        return <img src={message.content} alt="image" className="max-w-full rounded-md" />;
      case 'gif':
      case 'sticker':
        return <img src={message.content} alt={message.contentType} className="w-28" />;
      case 'text':
      default:
        return message.content;
    }
  };

  // 处理并渲染消息组和时间分隔
  const renderMessages = () => {
    const items = processedMessages();

    return items.map((item) => {
      // 渲染时间分隔
      if ('text' in item) {
        return (
          <div key={item.id} className="my-2 flex items-center justify-center">
            <div className="bg-base-200 text-base-content/50 rounded-full px-3 py-1 text-xs">{item.text}</div>
          </div>
        );
      }

      // 渲染消息组
      return (
        <div key={item.id} className={`chat ${item.isCurrentUser ? 'chat-end' : 'chat-start'}`}>
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <img alt={item.senderName} src={item.senderAvatar} />
            </div>
          </div>
          <div className="chat-header">{item.senderName}</div>
          <div className="chat-bubble-group flex flex-col gap-1">
            {item.messages.map((msg, index) => (
              <div
                key={msg.id}
                className={`chat-bubble bg-base-200 text-sm ${index === item.messages.length - 1 ? '' : 'chat-bubble-no-arrow'}`}
              >
                {renderMessageContent(msg)}
                {index === item.messages.length - 1 && (
                  <time className="float-right mt-1 ml-2 text-xs opacity-50">{formatTime(msg.timestamp)}</time>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="flex h-full flex-col">
      {/* 聊天消息区域 - 只有这部分可滚动 */}
      <div ref={chatContainerRef} className="bg-base-300 flex-1 overflow-y-auto pb-4">
        <div className="flex flex-col gap-2 px-6 py-4">
          {renderMessages()}

          {/* 加载状态指示器 */}
          {isLoading && (
            <div className="flex justify-center py-2">
              <div className="loading loading-dots loading-sm"></div>
            </div>
          )}
        </div>
      </div>

      {/* 表情选择器 */}
      {showEmojiPicker && (
        <div id="emoji-picker">
          <EmojiPicker
            onSelectEmoji={handleEmojiSelect}
            onSelectMedia={handleSendMedia}
            onClose={() => setShowEmojiPicker(false)}
          />
        </div>
      )}

      <div className="bg-base-200 border-base-300 relative flex items-center gap-2 border-t p-2">
        <button
          id="emoji-button"
          className={`btn btn-circle btn-sm ${showEmojiPicker ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
        </button>

        {/* 输入框 */}
        <input
          type="text"
          className="input input-md bg-base-100 flex-1"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />

        {/* 发送按钮 */}
        <button
          className="btn btn-sm btn-secondary h-10 w-12"
          onClick={handleSendMessage}
          disabled={!message.trim() || !user}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M2.48426 1.83016C2.28295 1.80163 2.08088 1.87699 1.94742 2.03038C1.81395 2.18376 1.76725 2.3943 1.82334 2.58974L2.95426 6.53044C3.10191 7.04492 3.57245 7.39941 4.1077 7.39941H9.00006C9.33143 7.39941 9.60006 7.66804 9.60006 7.99941C9.60006 8.33079 9.33143 8.59942 9.00006 8.59942H4.10771C3.57245 8.59942 3.10192 8.95391 2.95427 9.46839L1.82334 13.4091C1.76725 13.6045 1.81395 13.8151 1.94742 13.9685C2.08088 14.1219 2.28295 14.1972 2.48426 14.1687C7.15447 13.5068 11.3768 11.4544 14.7187 8.44531C14.8451 8.33153 14.9172 8.16947 14.9172 7.99943C14.9172 7.82938 14.8451 7.66732 14.7187 7.55354C11.3768 4.54445 7.15447 2.4921 2.48426 1.83016Z"
              fill="#E7FB78"
              fillOpacity="0.8"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
