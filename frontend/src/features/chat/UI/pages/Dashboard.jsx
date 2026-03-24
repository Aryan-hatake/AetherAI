import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from "rehype-highlight"
import {
  PlusCircle,
  MessageSquare,
  History,
  Layers,
  Settings,
  Bell,
  BookOpen,
  Archive,
  Zap,
  Paperclip,
  Mic,
  ArrowUp,
  Sliders
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useChat } from '../../hooks/useChat';
import { useSelector } from 'react-redux';
import { registerAIListener,removeAIListener } from '../../sockets/chat.socket';





const FOOTER_NAV = [
  { id: 'docs', label: 'Documentation', icon: 'BookOpen' },
  { id: 'archive', label: 'Archive', icon: 'Archive' },
];


export default function Dashboard() {

  const { handleGetChats, handleChatMsg, handlePrompt , handleAIResponse } = useChat()

  const chats = useSelector(state => state.chat.chats)
  const chatMsg = useSelector(state => state.chat.chatMsg)
  const activeChatId = useSelector(state => state.chat.activeChatId)


useEffect(() => {
  const handler = (msg) => {
    handleAIResponse(msg, activeChatId)
  }

  registerAIListener(handler)

  return () => {
    removeAIListener(handler)
  }
}, [])



 
 
  useEffect(() => {

    (async function () {
      await handleGetChats()
      
      if (activeChatId && activeChatId !== 999) {
        await handleChatMsg(activeChatId)
      }
    })()

   

  }, [activeChatId])







  const [inputValue, setInputValue] = useState('');


  const selectedChat = async (id) => {
    await handleChatMsg(id)
  }


  const handleSubmit = async () => {

      if (!inputValue.trim()) return;
   
      setInputValue('');
      
      handlePrompt(inputValue, activeChatId)
      
    // Simulate AI response
    // setTimeout(() => {
    //   const aiResponse = {
    //     id: (Date.now() + 1).toString(),
    //     role: 'ai',
    //     content: "I've processed your request. Implementing those mesh gradients will definitely elevate the visual hierarchy. Would you like me to generate the CSS snippets for you?",
    //     timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    //     type: 'text'
    //   };

    // }, 1000);
  };



  const renderIcon = (iconName, className) => {
    switch (iconName) {
      case 'MessageSquare': return <MessageSquare className={className} />;
      case 'History': return <History className={className} />;
      case 'Layers': return <Layers className={className} />;
      case 'Sliders': return <Sliders className={className} />;
      case 'BookOpen': return <BookOpen className={className} />;
      case 'Archive': return <Archive className={className} />;
      default: return null;
    }
  };

  function formatMessageTime(timestamp) {
    const date = new Date(timestamp)
    const now = new Date()

    const diffInMs = now - date
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))

    // 1. Just now
    if (diffInMinutes < 1) {
      return "now"
    }

    // Extract parts
    const d1 = {
      day: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear()
    }

    const d2 = {
      day: now.getDate(),
      month: now.getMonth(),
      year: now.getFullYear()
    }

    // 2. Same day
    const isToday =
      d1.day === d2.day &&
      d1.month === d2.month &&
      d1.year === d2.year

    if (isToday) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    }

    // 3. Yesterday (fixed logic)
    const yesterday = new Date(now)
    yesterday.setDate(now.getDate() - 1)

    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()

    if (isYesterday) {
      return `Yesterday, ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })}`
    }

    // 4. Same year
    if (d1.year === d2.year) {
      return date.toLocaleDateString([], {
        day: "numeric",
        month: "short"
      })
    }

    // 5. Different year
    return date.toLocaleDateString([], {
      day: "numeric",
      month: "short",
      year: "numeric"
    })
  }



  return (
    <div className="flex h-screen bg-gradient-to-t from-gray-800 to-slate-950  overflow-hidden font-body">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen flex flex-col py-8 bg-surface-low w-72 rounded-r-3xl z-40 border-r border-white/5">
        <div className="px-8 mb-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.4)]">
              <Zap className="text-red-600 fill-current w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-red-200 font-headline leading-none">Aether</h2>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">V2.0 Curator</p>
            </div>
          </div>
          <button className="w-full group relative flex items-center justify-center gap-3 py-4 bg-gradient-to-tl from-red-500 to-red-700 text-white font-bold rounded-2xl shadow-[0_10px_30px_-10px_rgba(239,68,68,0.5)] active:scale-95 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0    group-hover:opacity-100 transition-opacity"></div>
            <PlusCircle className="w-5 h-5 text-red-300" />
            <span>New Chat</span>
          </button>
        </div>

        <nav className="flex-1 flex flex-col overflow-y-auto hide-scrollbar">
          <div className="space-y-1">
            {chats.map((item) => (
              <a
                key={item._id}
                href="#"
                onClick={() => { selectedChat(item._id) }}
                className={`flex items-center gap-4 py-3 px-8 transition-all ${item.active
                  ? 'text-white bg-gradient-to-r from-red-200/20 to-transparent border-r-2 border-red-300'
                  : 'text-slate-500 hover:text-slate-200 hover:bg-red-300/5'
                  }`}
              >
                {renderIcon("History", `w-5 h-5 ${item.active ? 'text-red-500 fill-current' : ''}`)}
                <span className="font-medium">{item.title}</span>
              </a>
            ))}
          </div>

          <div className="mt-auto pt-8 space-y-1">
            {FOOTER_NAV.map((item) => (
              <a
                key={item.id}
                href="#"
                className="flex items-center gap-4 text-slate-500 py-3 px-8 hover:text-slate-200 transition-all"
              >
                {renderIcon(item.icon, "w-4 h-4")}
                <span className="text-sm">{item.label}</span>
              </a>
            ))}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-72 flex-1 h-screen flex flex-col relative mesh-gradient overflow-hidden">
        {/* Top Bar */}
        <header className="fixed top-0 right-0 left-72 z-50 flex justify-between items-center px-8 h-16 bg-slate-900/70 backdrop-blur-2xl border-b border-white/5 shadow-[0_8px_32px_0_rgba(239,68,68,0.05)]">
          <nav className="hidden md:flex items-center gap-8">
            <a className="text-white font-bold transition-all duration-300 hover:bg-white/5 px-3 py-1 rounded-lg" href="#">Current Session</a>
            <a className="text-slate-400 transition-all duration-300 hover:bg-white/5 px-3 py-1 rounded-lg" href="#">Vault</a>
            <a className="text-slate-400 transition-all duration-300 hover:bg-white/5 px-3 py-1 rounded-lg" href="#">Parameters</a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="text-slate-400 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
              <img
                alt="User profile"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_PBA7rW0eSIzTtsTsCgZynF6D5yj6ljuEmzqXvIBXb_g-TZqkxZrnU0rx8v5s1gIODpPdNUsS8F7Py3CSkxdMQREnqq6dATK4AQgaVDjtt18DlhW7T9w-CgW-fm36tOTpHxthYO2fV9x6ZgqSlnkYDiAZ62iVLStkDErhvZQAN3fBi3XEfjx7aFhyGYu5ta-VmrLqUrRXy1qTilmwvc-yPvdpHHhU9z5nzHJdOwGIC9qEpVFBRdyDoPyHj8rGj_rnZc00zez1DIE"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <div className="chat-area flex-1 overflow-y-auto px-8 pt-24 pb-12 hide-scrollbar flex flex-col max-w-5xl mx-auto w-full">
          {/* Welcome State */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 space-y-6"
          >
            <h1 className="text-6xl font-black font-headline text-white tracking-tight leading-none">
              What shall we <br /><span className="text-red-600">curate</span> today?
            </h1>
            <p className="text-slate-400 text-lg max-w-md mx-auto font-light">
              The Digital Curator is ready to assist your creative and technical workflow with high-precision intelligence.
            </p>
          </motion.div>

          {/* Messages */}
          <div className="flex flex-col gap-10">
            <AnimatePresence>
              {chatMsg[activeChatId]?.map((msg) => {

                const date = formatMessageTime(msg.updatedAt)

                return (<motion.div
                  key={msg._id}
                  initial={{ opacity: 0, x: msg.role === 'ai' ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex items-start text-white/50 gap-4 ${msg.role === 'user' ? 'max-w-3xl ml-auto  flex-row-reverse' : 'max-w-4xl'}`}
                >
                  <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center border ${msg.role === 'ai'
                    ? 'bg-surface-high border-white/5'
                    : 'overflow-hidden border-2 border-brand-red/30'
                    }`}>
                    {msg.role === 'ai' ? (
                      <Zap className="text-red-500 fill-current w-4 h-4" />
                    ) : (
                      <img
                        alt="User profile"
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuD31fnuOuL2-1ziuj2qR44607El-GDZHQ3cnGSzBI4CORIt1bc3IWXCnyHFAisVoBQ9rKNOvvG9StguKHr5knvEjyN00hQFG4EMTCI0QD5iMdaIqT-gf88aKwCO_lybEzTGKgibRl96nZoKKuo8I5q-dC3r3YRB34lAyOK21jQO-QgpTGubfjKEa31vNosdmDX-JDiZ-rukWJUc3khaoEhJMXAGdVIlxv08HjLK7WeTJ8f1GFDCC8mPUdXsQQgt9Z703y4LVBquJsE"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>

                  <div className={`relative group ${msg.role === 'user' ? 'text-right bg-neutral-800 rounded-br-2xl rounded-l-2xl ' : ''}`}>
                    <div className={`p-6 rounded-3xl shadow-xl ${msg.role === 'ai'
                      ? ' rounded-tl-none bg-neutral-900 border-l-2 border-red-900'
                      : 'bg-surface-highest rounded-tr-none'
                      }`}>

                      {
                        msg.role === 'ai' ? (
                          <div className="prose prose-invert max-w-none text-left">

                            <ReactMarkdown

                              rehypePlugins={[rehypeHighlight]}>
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                        ) :
                          (

                            <p className="text-on-surface leading-relaxed text-left">
                              {msg.content}
                            </p>
                          )
                      }

                      {/* {msg.type === 'bento' && (
                        <div className="grid grid-cols-12 gap-3 h-64 mt-6">
                          <div className="col-span-8 bg-surface-high rounded-2xl overflow-hidden relative group border border-white/5">
                            <div className="absolute inset-0 bg-gradient-to-tr from-brand-red/10 to-transparent"></div>
                            <div className="absolute bottom-4 left-4">
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Featured Module</p>
                              <h4 className="text-white font-bold">Dynamic Mesh Canvas</h4>
                            </div>
                          </div>
                          <div className="col-span-4 bg-surface-highest rounded-2xl p-4 border border-white/5 flex flex-col justify-between">
                            <Zap className="text-brand-red w-5 h-5 fill-current" />
                            <div className="h-2 w-12 bg-brand-red/20 rounded-full"></div>
                          </div>
                          <div className="col-span-4 bg-surface-highest rounded-2xl p-4 border border-white/5">
                            <div className="w-full h-full bg-slate-800/50 rounded-lg animate-pulse"></div>
                          </div>
                          <div className="col-span-8 bg-brand-red rounded-2xl p-4 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                            <p className="text-white font-black font-headline">Premium Contrast</p>
                          </div>
                        </div>
                      )} */}
                    </div>
                    <span className={`absolute -bottom-6 ${msg.role === 'user' ? 'right-2' : 'left-2'} text-[10px] text-slate-600 font-bold uppercase tracking-widest`}>
                      {msg.role === 'ai' ? 'Aether AI' : 'You'} • {date}
                    </span>
                  </div>
                </motion.div>
                )
              })}
            </AnimatePresence>
            <div />
          </div>
        </div>

        {/* Input Area */}
        <div className="sticky bottom-0 left-0 right-0 px-8 pb-8 pt-4">
          <div className="max-w-5xl mx-auto w-full">
            <div className="relative group">
              <div className="absolute inset-0 bg-surface-highest/80 backdrop-blur-3xl rounded-3xl border border-white/5 transition-all group-focus-within:border-red-400/70 shadow-2xl"></div>
              <div className="relative flex items-center px-6 py-4 gap-4">
                <button className="p-3 text-white/40 hover:text-red-300 transition-colors rounded-full hover:bg-white/5">
                  <Paperclip className="w-5 h-5" />
                </button>
                <input
                  className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-white/30 font-medium py-4 text-lg outline-none"
                  placeholder="Message Aether AI..."
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />
                <div className="flex items-center gap-2">
                  <button className="hidden sm:flex items-center gap-2 p-3 text-white/40 hover:text-white transition-colors rounded-full hover:bg-white/5">
                    <Mic className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="w-14 h-14 bg-red-500/90 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-red-900/40 hover:scale-105 active:scale-95 transition-all"
                  >
                    <ArrowUp className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Suggestion Chips */}
            <div className="flex justify-center gap-2 mt-4 opacity-60 hover:opacity-100 transition-opacity">
              {['Optimize Performance', 'Generate Assets', 'Code Review'].map((chip) => (
                <button
                  key={chip}
                  className="px-4 py-1.5 rounded-full bg-surface-high border border-white/5 text-[11px] font-bold text-slate-400 uppercase tracking-wider hover:bg-red-400/10 hover:text-red-400 transition-all"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Footer */}
            <footer className="mt-6 flex flex-col sm:flex-row justify-center gap-6 items-center pb-2">
              <span className="text-[10px] text-white/30 uppercase tracking-widest font-inter">© 2024 Aether Intelligence. All rights reserved.</span>
              <div className="flex gap-4">
                <a className="text-[10px] text-white/30 hover:text-red-500 uppercase tracking-widest transition-colors" href="#">Privacy Policy</a>
                <a className="text-[10px] text-white/30 hover:text-red-500 uppercase tracking-widest transition-colors" href="#">Terms of Service</a>
                <a className="text-[10px] text-white/30 hover:text-red-500 uppercase tracking-widest transition-colors" href="#">API Docs</a>
              </div>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
}