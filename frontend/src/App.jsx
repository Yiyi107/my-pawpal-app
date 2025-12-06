import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaPaw, FaBook, FaRobot, FaTimes, FaImage } from 'react-icons/fa';

// --- 图片源 (保持稳定) ---
const DOG_IDLE = "https://images.pexels.com/photos/1633522/pexels-photo-1633522.jpeg?auto=compress&cs=tinysrgb&w=600"; 
const DOG_THINKING = "https://images.pexels.com/photos/69371/pexels-photo-69371.jpeg?auto=compress&cs=tinysrgb&w=600"; 

// --- 梦幻气泡颜色池 ---
const BUBBLE_COLORS = [
  "bg-pink-300/30 text-pink-700",    
  "bg-purple-300/30 text-purple-700", 
  "bg-blue-300/30 text-blue-700",    
  "bg-teal-300/30 text-teal-700",    
  "bg-orange-300/30 text-orange-700", 
  "bg-indigo-300/30 text-indigo-700", 
];

function App() {
  const [activeTab, setActiveTab] = useState('journal');

  return (
    <div className="min-h-screen bg-paw-bg font-cute text-gray-600 overflow-hidden selection:bg-paw-primary selection:text-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-30 p-4 flex justify-center pointer-events-none">
        <div className="bg-white/70 backdrop-blur-md px-6 py-2 rounded-full shadow-sm flex items-center gap-2 pointer-events-auto border border-white/50">
          <FaPaw className="text-paw-primary text-xl" />
          <h1 className="text-xl font-bold text-gray-700 tracking-wide font-cute">PawPal</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="h-screen w-full relative">
        {activeTab === 'journal' ? <JournalView /> : <ChatBotView />}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md px-8 py-4 rounded-full shadow-2xl border border-white/60 flex gap-10 z-40">
        <button 
          onClick={() => setActiveTab('journal')}
          className={`transition-all duration-300 active:scale-95 ${activeTab === 'journal' ? 'text-paw-primary scale-125 drop-shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <FaBook className="text-2xl" />
        </button>
        <div className="w-[1px] h-6 bg-gray-300 self-center opacity-50"></div>
        <button 
          onClick={() => setActiveTab('chat')}
          className={`transition-all duration-300 active:scale-95 ${activeTab === 'chat' ? 'text-paw-primary scale-125 drop-shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <FaRobot className="text-2xl" />
        </button>
      </nav>
    </div>
  );
}

// --- 1. 梦幻日记视图 ---
function JournalView() {
  const [logs, setLogs] = useState([
    { id: 1, text: "Playdate!", date: "Oct 24", colorIdx: 0, x: 15, y: 25, img: null },
    { id: 2, text: "So fluffy.", date: "Oct 25", colorIdx: 2, x: 75, y: 15, img: "https://images.unsplash.com/photo-1591769225440-811ad7d6eca6?q=80&w=200&auto=format&fit=crop" },
  ]);
  const [input, setInput] = useState("");
  const [selectedLog, setSelectedLog] = useState(null);
  const [tempImage, setTempImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setTempImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const addLog = () => {
    if(!input.trim() && !tempImage) return;
    const newLog = { 
      id: Date.now(), 
      text: input, 
      date: "Just now",
      colorIdx: Math.floor(Math.random() * BUBBLE_COLORS.length),
      x: Math.random() < 0.5 ? Math.random() * 20 : 60 + Math.random() * 20, 
      y: Math.random() * 60 + 10,
      img: tempImage 
    };
    setLogs([...logs, newLog]);
    setInput("");
    setTempImage(null);
  };

  return (
    <div className="h-full w-full relative overflow-hidden flex items-center justify-center animate-fade-in bg-gradient-to-b from-blue-50/40 via-purple-50/40 to-pink-50/40">
      
      {/* A. 漂浮气泡 */}
      {logs.map((log, index) => (
        <div 
          key={log.id}
          onClick={() => setSelectedLog(log)}
          className={`absolute rounded-full cursor-pointer hover:scale-105 transition-transform duration-500 flex items-center justify-center text-center animate-float-dreamy glass-bubble overflow-hidden z-10 ${BUBBLE_COLORS[log.colorIdx]}`}
          style={{ 
            left: `${log.x}%`, 
            top: `${log.y}%`,
            width: log.img ? '180px' : '140px',  
            height: log.img ? '180px' : '140px',
            animationDelay: `${index * 0.5}s`, 
          }}
        >
           {log.img ? (
             <img src={log.img} className="w-full h-full object-cover opacity-85 hover:opacity-100 transition duration-500" alt="memory" />
           ) : (
             <div className="p-3">
               <p className="text-[10px] uppercase font-bold opacity-60 mb-1">{log.date}</p>
               <p className="text-sm font-bold leading-tight px-1 drop-shadow-sm">{log.text}</p>
             </div>
           )}
        </div>
      ))}

      {/* B. 输入框区域 */}
      <div className="relative z-20 w-[85%] max-w-sm">
        <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-2 border border-white/60 ring-4 ring-white/20">
          <div className="bg-white/70 rounded-[2rem] p-5 relative overflow-hidden transition-all focus-within:bg-white/90">
             
             {tempImage && (
               <div className="mb-3 relative rounded-2xl overflow-hidden h-36 w-full shadow-inner">
                 <img src={tempImage} className="w-full h-full object-cover" alt="preview" />
                 <button onClick={() => setTempImage(null)} className="absolute top-2 right-2 bg-black/40 text-white rounded-full p-1.5 hover:bg-black/60 transition"><FaTimes size={10}/></button>
               </div>
             )}

             <textarea 
               className="w-full notebook-texture text-gray-700 focus:outline-none resize-none text-lg bg-transparent font-cute placeholder-gray-400"
               placeholder="Capture a bubble memory... 🫧"
               rows="2"
               value={input}
               onChange={(e) => setInput(e.target.value)}
             />
             
             <div className="flex justify-between items-center mt-3 border-t border-gray-200/50 pt-3">
               <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleImageUpload}/>
               <button onClick={() => fileInputRef.current.click()} className="text-gray-400 hover:text-paw-primary text-xl transition hover:scale-110">
                 <FaImage />
               </button>

               <button 
                 onClick={addLog}
                 className="bg-paw-primary text-white px-6 py-2 rounded-full text-sm font-bold shadow-md hover:bg-red-300 transition-all active:scale-95 flex items-center gap-2"
               >
                 Float <span className="text-lg">☁️</span>
               </button>
             </div>
          </div>
        </div>
      </div>

      {/* C. 详情弹窗 */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm p-6 animate-fade-in">
          <div className="bg-white/80 p-8 rounded-[3rem] w-full max-w-sm shadow-2xl relative border border-white backdrop-blur-md">
            <button onClick={() => setSelectedLog(null)} className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition"><FaTimes size={20}/></button>
            <div className="flex flex-col items-center text-center">
              <span className={`px-4 py-1 rounded-full text-xs font-bold mb-5 ${BUBBLE_COLORS[selectedLog.colorIdx].split(' ')[0]} ${BUBBLE_COLORS[selectedLog.colorIdx].split(' ')[1]}`}>
                {selectedLog.date}
              </span>
              {selectedLog.img && (
                <div className="w-full h-56 rounded-[2rem] overflow-hidden mb-5 shadow-lg border-4 border-white">
                  <img src={selectedLog.img} className="w-full h-full object-cover" alt="detail" />
                </div>
              )}
              <p className="text-xl font-medium text-gray-700 leading-relaxed font-cute">{selectedLog.text}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- 2. 聊天机器人视图 (关键修复) ---
function ChatBotView() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null); // 用于自动滚动到底部

  const dogImage = loading ? DOG_THINKING : DOG_IDLE;

  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      // ⚠️ 关键修复：
      // 1. 地址必须是 localhost:8000 (Python后端)
      // 2. 发送的数据是 { message: ... }，不是 messages: [...]
      const response = await axios.post('https://my-pawpal-app.onrender.com/api/chat', { 
        message: userMsg 
      });
      setMessages(prev => [...prev, { sender: 'bot', text: response.data.reply }]);
    } catch (error) {
      console.error(error); // 在控制台打印详细错误，方便调试
      setMessages(prev => [...prev, { sender: 'bot', text: `Oops! I couldn't connect. (${error.message}) 🐾` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full pt-24 pb-28 px-4 bg-gradient-to-b from-white to-paw-bg">
      
      {/* 狗狗展示 */}
      <div className="flex-shrink-0 flex flex-col items-center justify-center mb-6">
         <div className="w-44 h-44 rounded-full border-[6px] border-white shadow-xl overflow-hidden relative group">
           <img 
             src={dogImage} 
             alt="Australian Shepherd" 
             className={`w-full h-full object-cover transition-all duration-700 ease-in-out ${loading ? 'scale-110 blur-[1px]' : 'scale-100'}`}
           />
           {loading && (
             <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
               <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
             </div>
           )}
         </div>
         <div className="mt-4 px-8 text-center">
            <p className="text-base font-bold text-paw-primary tracking-wide font-cute leading-relaxed drop-shadow-sm">
              {loading ? "Thinking really hard..." : "Pawlease ask me anything about your Furry Friend! 🐾"}
            </p>
         </div>
      </div>

      {/* 聊天记录 */}
      <div className="flex-1 overflow-y-auto space-y-4 px-2 scrollbar-hide">
        {messages.length === 0 && <div className="h-10"></div>}
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-5 py-3 rounded-[1.5rem] text-sm font-medium leading-relaxed shadow-sm font-cute ${
              msg.sender === 'user' 
                ? 'bg-paw-primary text-white rounded-tr-none' 
                : 'bg-white text-gray-600 border border-gray-100 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {/* 一个看不见的元素，用于定位底部 */}
        <div ref={messagesEndRef} />
      </div>
      
      {/* 底部输入区域：分离式设计 */}
      <div className="mt-4 flex items-end gap-3 px-2 z-20">
        {/* 左边：短胶囊输入框 */}
        <div className="flex-1 bg-white p-2 pl-5 rounded-[2rem] shadow-lg border border-gray-100 flex items-center">
          <input 
            type="text" 
            className="w-full bg-transparent focus:outline-none text-gray-600 text-sm font-bold font-cute placeholder-gray-300 py-2"
            placeholder="Type your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
        </div>
        
        {/* 右边：爪爪发送按钮 */}
        <button 
          onClick={sendMessage} 
          disabled={loading}
          className="bg-paw-primary text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-red-300 hover:scale-110 active:scale-90 transition-all disabled:opacity-50 disabled:scale-100"
        >
          <FaPaw className="text-2xl rotate-12" />
        </button>
      </div>
    </div>
  );
}

export default App;