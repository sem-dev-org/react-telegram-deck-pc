import React from 'react';

// 表情类型
type EmojiPickerType = 'emoji' | 'gif' | 'sticker';

// 常用表情列表
const EMOJI_LIST = [
  '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '😊',
  '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '😋', '😛',
  '😜', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐',
  '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪',
  '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶',
  '😵', '🤯', '🤠', '🥳', '😎', '🤓', '👋', '👍', '👎', '❤️'
];

// GIF列表 - 真实项目中这通常来自API或CDN
const GIF_LIST = [
  '/images/stickers/1.gif',
  '/images/stickers/2.gif',
  '/images/stickers/3.gif',
  '/images/stickers/4.gif',
  '/images/stickers/5.gif',
  '/images/stickers/6.gif',
  '/images/stickers/7.gif',
  '/images/stickers/8.gif',
];

// 贴纸列表 - 真实项目中这通常来自API或CDN
const STICKER_LIST = [
  '/images/stickers/sticker1.png',
  '/images/stickers/sticker2.png',
  '/images/stickers/sticker3.png',
  '/images/stickers/sticker4.png',
];

interface EmojiPickerProps {
  onSelectEmoji: (emoji: string) => void;
  onSelectMedia: (url: string, type: 'gif' | 'sticker') => void;
  onClose: () => void;
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelectEmoji, onSelectMedia, onClose }) => {
  const [activeTab, setActiveTab] = React.useState<EmojiPickerType>('emoji');

  return (
    <div className="absolute bottom-16 left-0 z-10 w-72 rounded-lg bg-base-100 shadow-xl border border-base-300 text-sm">
      {/* 标签栏 */}
      <div className="flex border-b border-base-300">
        <button
          className={`flex-1 p-2 ${activeTab === 'emoji' ? 'bg-base-200' : ''}`}
          onClick={() => setActiveTab('emoji')}
        >
          Emoji
        </button>
        <button
          className={`flex-1 p-2 ${activeTab === 'gif' ? 'bg-base-200' : ''}`}
          onClick={() => setActiveTab('gif')}
        >
          GIF
        </button>
        <button
          className={`flex-1 p-2 ${activeTab === 'sticker' ? 'bg-base-200' : ''}`}
          onClick={() => setActiveTab('sticker')}
        >
          Stickers
        </button>
        <button className="p-2" onClick={onClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* 内容区 */}
      <div className="max-h-60 overflow-y-auto p-2">
        {activeTab === 'emoji' && (
          <div className="grid grid-cols-8 gap-1">
            {EMOJI_LIST.map((emoji, index) => (
              <button
                key={index}
                className="btn btn-sm btn-ghost p-1 text-xl"
                onClick={() => onSelectEmoji(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {activeTab === 'gif' && (
          <div className="grid grid-cols-2 gap-2">
            {GIF_LIST.map((gif, index) => (
              <button
                key={index}
                className="overflow-hidden rounded"
                onClick={() => onSelectMedia(gif, 'gif')}
              >
                <img src={gif} alt={`gif-${index}`} className="h-20 w-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {activeTab === 'sticker' && (
          <div className="grid grid-cols-3 gap-2">
            {STICKER_LIST.map((sticker, index) => (
              <button
                key={index}
                className="overflow-hidden rounded"
                onClick={() => onSelectMedia(sticker, 'sticker')}
              >
                <img src={sticker} alt={`sticker-${index}`} className="h-16 w-full object-contain" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 