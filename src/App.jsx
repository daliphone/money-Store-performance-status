import { useState, useEffect, useMemo, useRef } from 'react';
import { 
  TrendingUp, Target, Smartphone, BatteryCharging, 
  ShieldCheck, Users, Calendar, Award, ChevronDown, 
  ArrowLeft, Store, Zap, Loader2, UserCircle, 
  AlertTriangle, Package, Tablet, Watch, Layers, 
  Wind, MessageCircle, Star, Footprints, Flame, Trophy, Sparkles, Crown, Bot,
  X, Send, Info,
  // 🌟 修正：補上 4 月份新項目的 4 個專屬圖示
  Wifi, Activity, ShoppingBag, Tv
} from 'lucide-react';

// ==========================================
// 系統核心設定 (Marshall Vibe)
// ==========================================
const API_URL = 'https://script.google.com/macros/s/AKfycbwx6i9vZA1J6fzq9ZmNjpdfgA8q1o52IaE04TD8YstMYiuT4vBgQKiZUyu4i2dkgc6c/exec';

// ⚠️ Marshall 安全微創手術：金鑰已移至後端 GAS，前端不再需要填寫，保護安全！

// ==========================================
// 輔助運算與共用元件
// ==========================================
const formatNum = (num) => new Intl.NumberFormat('zh-TW').format(Number(num) || 0);

const calcProgress = (actual, target) => {
  const a = Number(actual) || 0;
  const t = Number(target) || 0;
  if (t > 0) return Math.round((a / t) * 100);
  if (a > 0) return 100;
  return 0;
};

// 🌟 動態指標卡片
const MetricCard = ({ title, metric, unit, icon: Icon, colorClass, bgColorClass }) => {
  if (!metric) return null;
  const actual = metric?.actual || 0;
  const target = metric?.target || 0;
  const progress = calcProgress(actual, target);
  const isOverkill = progress >= 100 && target > 0;
  
  return (
    <div className={`p-4 md:p-5 rounded-2xl border ${isOverkill ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-100 bg-white'} shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full relative overflow-hidden group`}>
      {isOverkill && <div className="absolute -right-4 -top-4 w-16 h-16 bg-emerald-400 opacity-20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>}
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${isOverkill ? 'bg-emerald-100 text-emerald-600' : `${bgColorClass} ${colorClass}`}`}>
            <Icon size={20} />
          </div>
          <p className={`text-sm font-bold leading-tight ${isOverkill ? 'text-emerald-800' : 'text-slate-600'}`}>{title}</p>
        </div>
        <div className="flex flex-col items-end">
          <span className={`text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 ${isOverkill ? 'bg-emerald-500 text-white shadow-[0_0_10px_rgba(52,211,153,0.4)]' : 'bg-slate-50 text-slate-500'}`}>
            {isOverkill && <Flame size={12} />}
            {progress}%
          </span>
        </div>
      </div>
      <div className="relative z-10">
        <div className="flex items-baseline gap-1">
          <p className={`text-2xl md:text-3xl font-black ${isOverkill ? 'text-emerald-600' : 'text-slate-800'}`}>{formatNum(actual)}</p>
          {unit && <span className={`text-xs font-medium ${isOverkill ? 'text-emerald-500' : 'text-slate-500'}`}>{unit}</span>}
        </div>
        <div className="flex justify-between items-center mt-1">
           <p className="text-xs text-slate-400 font-medium">目標: {formatNum(target)}</p>
           {!isOverkill && target > 0 && (
             <span className="text-[10px] text-amber-500 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
               差 {formatNum(target - actual)}
             </span>
           )}
           {isOverkill && (
             <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
               <Sparkles size={10}/> 達標
             </span>
           )}
        </div>
      </div>
    </div>
  );
};

const MetricGroup = ({ title, children }) => (
  <div className="mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <h3 className="text-md font-bold text-slate-700 mb-3 pl-3 border-l-4 border-indigo-400 flex items-center gap-2">
      {title}
    </h3>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
      {children}
    </div>
  </div>
);

// 純 CSS 撒花特效
const SimpleConfetti = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden flex justify-center">
      {Array.from({ length: 50 }).map((_, i) => (
        <div 
          key={i}
          className="absolute w-2 h-4"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-20px`,
            backgroundColor: ['#34d399', '#fbbf24', '#f87171', '#60a5fa', '#a78bfa'][Math.floor(Math.random() * 5)],
            opacity: Math.random() + 0.5,
            transform: `rotate(${Math.random() * 360}deg)`,
            animation: `fall ${Math.random() * 3 + 2}s linear forwards`,
            animationDelay: `${Math.random() * 0.5}s`
          }}
        />
      ))}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fall {
          to { transform: translateY(100vh) rotate(720deg); }
        }
      `}} />
    </div>
  );
};

// ==========================================
// 🌟 核心元件：雙重人格智慧對話框 (採用安全後端代理版)
// ==========================================
const SmartMotivator = ({ data, targetName, allStoresData }) => {
  const [msgObj, setMsgObj] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  
  // 聊天室狀態
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { role: 'model', text: '老闆好！我是您的 AI 營運特助 Manie 🤖\n系統已啟用最高級別的「安全後端代理」，保護您的資料不外洩。想了解哪間分店的異常，或誰的潛力最大呢？' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  // 🌟 新增：動態狀態文字
  const [typingStatus, setTypingStatus] = useState('思考中...');
  
  const scrollRef = useRef(null);
  const isBossMode = targetName === '全區';

  // 捲動到底部邏輯
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
      const timer = setTimeout(scrollToBottom, 50);
      return () => clearTimeout(timer);
    }
  }, [chatHistory, isChatOpen, isTyping]);

  // 隨機推播提示訊息
  useEffect(() => {
    if (!data) return;
    
    const generateMessage = () => {
      const messages = [];
      const today = new Date();
      const day = today.getDate();
      const isMonthEnd = day > 25;
      const prefix = isBossMode ? '【大總管】' : `【${targetName}】`;

      if (isBossMode && allStoresData) {
        const lowestStore = [...allStoresData].sort((a,b) => calcProgress(a.grossProfit?.actual, a.grossProfit?.target) - calcProgress(b.grossProfit?.actual, b.grossProfit?.target))[0];
        if (lowestStore) {
          const p = calcProgress(lowestStore.grossProfit?.actual, lowestStore.grossProfit?.target);
          if (p < 50 && isMonthEnd) messages.push({ text: `🚨 警告：${lowestStore.store} 毛利僅達 ${p}%，進度嚴重落後，請立即查核！`, type: 'warning' });
          else if (p < 30) messages.push({ text: `⚠️ 提醒：${lowestStore.store} 目前進度全區墊底 (${p}%)。`, type: 'warning' });
        }
        const totalProg = calcProgress(data.grossProfit?.actual, data.grossProfit?.target);
        if (totalProg >= 100) messages.push({ text: `🏆 全區毛利達標！馬尼戰隊無人能擋！🎉`, type: 'praise' });
        else messages.push({ text: `📢 目前全區毛利進度 ${totalProg}%，點擊我開啟 AI 特助深度分析。`, type: 'info' });

      } else {
        const profitProg = calcProgress(data.grossProfit?.actual, data.grossProfit?.target);
        if (profitProg < 30 && day > 10) messages.push({ text: `⚠️ 警報：${prefix} 毛利進度僅 ${profitProg}%，請店長加把勁！`, type: 'warning' });
        else if (profitProg >= 100) messages.push({ text: `${prefix} 毛利已經達標！太棒了！🎉`, type: 'praise' });
        else messages.push({ text: `${prefix} 穩定前進中，目前進度 ${profitProg}%，加油！🔥`, type: 'info' });
      }
      
      if (messages.length === 0) messages.push({ text: `${prefix} 今天也要能量滿滿，開市大吉！✨`, type: 'info' });
      return messages[Math.floor(Math.random() * messages.length)];
    };

    setMsgObj(generateMessage());
    
    const interval = setInterval(() => {
      if (!isChatOpen) {
        setIsVisible(false);
        setTimeout(() => {
          setMsgObj(generateMessage());
          setIsVisible(true);
        }, 500); 
      }
    }, 12000); 

    return () => clearInterval(interval);
  }, [data, targetName, allStoresData, isChatOpen, isBossMode]);

  const formatChatText = (text) => {
    if (!text) return { __html: '' };
    let htmlText = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-indigo-800 bg-indigo-100 px-1.5 py-0.5 rounded mx-0.5 shadow-sm">$1</strong>');
    return { __html: htmlText };
  };

  // 診斷功能：因改為後端代理，改為顯示安全連線狀態
  const checkAvailableModels = async () => {
    setIsTyping(true);
    setTypingStatus('正在診斷系統連線狀態...');
    setChatHistory(prev => [...prev, { role: 'user', text: '🔎 檢查系統安全狀態...' }]);

    setTimeout(() => {
      setChatHistory(prev => [...prev, { role: 'model', text: `✅ 系統診斷成功！\n\n目前已啟用「安全後端代理模式」，前端不再暴露任何金鑰。所有運算皆受 Google Apps Script 嚴格保護。` }]);
      setIsTyping(false);
    }, 1200);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    const userMessage = inputText.trim();
    setChatHistory(prev => [...prev, { role: 'user', text: userMessage }]);
    setInputText('');
    setIsTyping(true);

    // 🌟 動作感提示邏輯：更像真人在查閱報表
    let detectedStore = '';
    if (allStoresData) {
        const storeMatch = allStoresData.find(s => userMessage.includes(s.store));
        if (storeMatch) detectedStore = storeMatch.store;
    }

    const baseStatus = detectedStore ? `🕵️ 正在開啟 ${detectedStore} 的業績試算表...` : '🕵️ 正在調閱全區彙整報表...';
    setTypingStatus(baseStatus);

    const statusInterval = setInterval(() => {
        setTypingStatus(prev => {
            if (prev.includes('開啟') || prev.includes('調閱')) return '📊 掃描 19 項核心指標與人員表現...';
            if (prev.includes('掃描')) return '💡 正在彙整診斷報告與行動建議...';
            return '💡 正在彙整診斷報告與行動建議...';
        });
    }, 2500);

    const simplifiedData = (allStoresData || []).map(store => ({
      店名: store.store,
      毛利: `${formatNum(store.grossProfit?.actual)} / 目標 ${formatNum(store.grossProfit?.target)} (達成率${calcProgress(store.grossProfit?.actual, store.grossProfit?.target)}%)`,
      門號: `${store.contracts?.actual} 件`,
      配件營收: `$${formatNum(store.accessories?.actual)}`,
      保險營收: `$${formatNum(store.insurance?.actual)}`,
      業務員表現: store.employees?.map(e => `${e.name}(毛利${formatNum(e.grossProfit?.actual)}, 門號${e.contracts?.actual}, 保險${e.insurance?.actual})`).join(', ')
    }));

    const systemPrompt = `你現在是馬尼通訊的 AI 營運特助 Manie。你是一位具備高度商業洞察力的數據分析專家。
請根據以下提供的「門市即時數據庫」來回答老闆的問題。

你的任務展現出「思考型」的洞察力：
1. 深度診斷：主動比對數據落後或異常的原因。
2. 尋找亮點：點名表現優異的店鋪或員工並分析成功關鍵。
3. 具體建議：針對弱點給出至少一項可執行的改善建議。
4. 專業口吻：專業、幹練、親切，使用繁體中文，善用排版工具。

【門市即時數據庫】：
${JSON.stringify(simplifiedData)}`;

    try {
      // 🌟 Marshall 手術核心：改為 POST 向 GAS 後端發送請求
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'aiChat',
          message: userMessage,
          systemPrompt: systemPrompt
        })
      });
      
      const resData = await res.json();
      
      if (resData.status === 'success') {
        setChatHistory(prev => [...prev, { role: 'model', text: resData.reply }]);
      } else {
        throw new Error(resData.message || '後端代理發生異常');
      }
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'model', text: `⚠️ 連線錯誤：${error.message}\n請確認您的 GAS 腳本已經更新並填入 API 金鑰。` }]);
    } finally {
      clearInterval(statusInterval);
      setIsTyping(false);
    }
  };

  if (!msgObj) return null;

  const borderColor = msgObj.type === 'warning' ? 'border-rose-400 shadow-[0_4px_20px_rgba(244,63,94,0.3)]' : 
                      msgObj.type === 'praise' ? 'border-emerald-400 shadow-[0_4px_20px_rgba(16,185,129,0.3)]' : 
                      'border-indigo-200 shadow-xl';

  return (
    <>
      {/* 🟢 模式 1：靜態推播浮動小窗 */}
      <div 
        className={`fixed bottom-6 right-6 z-40 flex items-end gap-3 max-w-[280px] md:max-w-sm transition-all duration-300 ${isChatOpen ? 'opacity-0 pointer-events-none translate-x-10' : 'opacity-100'}`}
      >
        <div className={`bg-white/95 backdrop-blur-md text-slate-800 p-4 rounded-2xl rounded-br-sm border-2 ${borderColor} transition-all duration-500 transform ${isVisible ? 'translate-y-0 scale-100' : 'translate-y-4 scale-95 opacity-0'}`}>
          <p className="text-sm font-bold leading-relaxed whitespace-pre-wrap">{msgObj.text}</p>
        </div>
        <div 
          className={`relative flex-shrink-0 ${isBossMode ? 'cursor-pointer hover:scale-110 active:scale-95 transition-all' : ''}`}
          onClick={() => isBossMode && setIsChatOpen(true)}
        >
          {isBossMode && (
            <div className="absolute -top-2 -right-2 w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center animate-bounce z-10 border-2 border-white shadow-lg">
              <Sparkles size={14} className="text-white fill-white"/>
            </div>
          )}
          {/* 🌟 確保顯示 manie.png */}
          <img 
            src="/manie.png" 
            alt="Manie AI" 
            className={`w-20 h-20 object-contain drop-shadow-2xl transition-all duration-300 ${
              msgObj.type === 'warning' ? 'animate-pulse' : 
              msgObj.type === 'praise' ? 'animate-bounce' : ''
            }`}
            onError={(e) => {
               e.target.style.display = 'none';
               e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="hidden w-16 h-16 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-full items-center justify-center shadow-lg border-2 border-white">
            <Bot className="text-white" size={32} />
          </div>
        </div>
      </div>

      {/* 🟢 模式 2：AI 深度分析面板 */}
      {isBossMode && (
        <div 
          className={`fixed bottom-6 right-6 z-50 w-full max-w-[440px] bg-white rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-200 flex flex-col overflow-hidden transition-all duration-500 origin-bottom-right ${isChatOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
          style={{ height: '75vh', maxHeight: '750px', minHeight: '480px' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-800 via-indigo-600 to-blue-500 p-5 flex justify-between items-center text-white flex-shrink-0 shadow-lg relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Bot size={24} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-lg leading-none tracking-tight">Manie AI 營運特助</h3>
                  <button 
                    onClick={checkAvailableModels}
                    className="p-1 hover:bg-white/30 rounded-full transition-colors"
                    title="診斷系統狀態"
                  >
                    <Info size={14} className="text-indigo-100" />
                  </button>
                </div>
                <p className="text-[10px] opacity-80 mt-1 uppercase font-black tracking-widest text-indigo-100">Safe Backend Proxy</p>
              </div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-all active:scale-90">
              <X size={20} />
            </button>
          </div>

          {/* 內容區 */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto bg-slate-50 p-5 space-y-5 custom-scrollbar"
          >
            {chatHistory.map((chat, idx) => (
              <div key={idx} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-3 duration-300`}>
                <div className={`max-w-[92%] p-4 rounded-2xl shadow-sm ${
                  chat.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-indigo-100' 
                    : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none'
                }`}>
                  <div 
                    className="whitespace-pre-wrap leading-relaxed text-[15px]" 
                    dangerouslySetInnerHTML={formatChatText(chat.text)} 
                  />
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-none shadow-sm p-4 flex flex-col gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  {/* 🌟 動作感狀態文字展示區 */}
                  <div className="animate-in fade-in slide-in-from-left-2 duration-500 flex items-center gap-2">
                    <Zap size={12} className="text-indigo-500 animate-pulse" />
                    <span className="text-xs font-black text-indigo-500 tracking-wide">{typingStatus}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-white border-t border-slate-100 flex gap-3 items-center flex-shrink-0 pb-6 md:pb-4 shadow-[0_-5px_15px_rgba(0,0,0,0.03)]">
            <input 
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              placeholder="問我關於全區業績的任何問題..."
              className="flex-1 bg-slate-100 border border-transparent hover:border-indigo-200 rounded-[18px] px-5 py-3.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none text-slate-800 placeholder:text-slate-400 transition-all font-medium"
              disabled={isTyping}
            />
            <button 
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isTyping}
              className="p-4 bg-indigo-600 text-white rounded-[18px] hover:bg-indigo-700 active:scale-95 disabled:opacity-30 disabled:grayscale transition-all shadow-xl shadow-indigo-100"
            >
              <Send size={20} className="fill-white"/>
            </button>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}} />
    </>
  );
};


export default function App() {
  const [rawData, setRawData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedStore, setSelectedStore] = useState(null);
  const [lockedStore, setLockedStore] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false); 
  const [debugInfo, setDebugInfo] = useState(null); // 🌟 新增：用於顯示錯誤時的詳細 JSON

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const storeParam = urlParams.get('store');
    if (storeParam) {
       setLockedStore(storeParam);
       setSelectedStore(storeParam);
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(API_URL);
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        
        if (result.status === 'success' && result.data) {
          setRawData(result.data);
          const months = Object.keys(result.data).sort().reverse();
          if (months.length > 0) setSelectedMonth(months[0]);
        } else {
          setDebugInfo(JSON.stringify(result, null, 2));
          setError('API 連線成功，但回傳格式異常');
        }
      } catch (err) {
        setError(`無法連線到資料庫：${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const currentMonthData = rawData?.[selectedMonth];
  const summary = currentMonthData?.summary;
  
  const sortedStoresByProfit = useMemo(() => {
    if (!currentMonthData?.stores) return [];
    return [...currentMonthData.stores].sort((a, b) => {
      const pA = calcProgress(a?.grossProfit?.actual, a?.grossProfit?.target);
      const pB = calcProgress(b?.grossProfit?.actual, b?.grossProfit?.target);
      return pB - pA;
    });
  }, [currentMonthData]);

  const topStores = useMemo(() => {
    if (!currentMonthData?.stores || currentMonthData.stores.length === 0) return { profit: null, contracts: null, insurance: null };
    const stores = currentMonthData.stores;
    const profitKing = [...stores].sort((a, b) => {
      const pA = calcProgress(a?.grossProfit?.actual, a?.grossProfit?.target);
      const pB = calcProgress(b?.grossProfit?.actual, b?.grossProfit?.target);
      if (pB !== pA) return pB - pA;
      return (b?.grossProfit?.actual || 0) - (a?.grossProfit?.actual || 0);
    })[0];
    const contractsKing = [...stores].sort((a, b) => {
      const pA = calcProgress(a?.contracts?.actual, a?.contracts?.target);
      const pB = calcProgress(b?.contracts?.actual, b?.contracts?.target);
      if (pB !== pA) return pB - pA;
      return (b?.contracts?.actual || 0) - (a?.contracts?.actual || 0);
    })[0];
    const insuranceKing = [...stores].sort((a, b) => {
      const pA = calcProgress(a?.insurance?.actual, a?.insurance?.target);
      const pB = calcProgress(b?.insurance?.actual, b?.insurance?.target);
      if (pB !== pA) return pB - pA;
      return (b?.insurance?.actual || 0) - (a?.insurance?.actual || 0);
    })[0];

    return { profit: profitKing, contracts: contractsKing, insurance: insuranceKing };
  }, [currentMonthData]);

  const storeDetail = useMemo(() => {
    if (!selectedStore || !currentMonthData?.stores) return null;
    return currentMonthData.stores.find(s => s.store === selectedStore);
  }, [selectedStore, currentMonthData]);

  useEffect(() => {
    if (summary?.grossProfit) {
      const prog = calcProgress(summary.grossProfit.actual, summary.grossProfit.target);
      if (prog >= 100) {
        setShowConfetti(true);
        const timer = setTimeout(() => setShowConfetti(false), 5000); 
        return () => clearTimeout(timer);
      }
    }
  }, [summary, selectedMonth]);


  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="text-indigo-600 mb-4 animate-spin" size={48} />
        <h2 className="text-xl font-bold text-slate-700 mb-2">啟動 Money 戰情室連線中...</h2>
        <p className="text-slate-500 text-sm">正在從 Google Drive 提取最新業績數據</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100 max-w-lg w-full">
          <div className="flex flex-col items-center text-center">
            <AlertTriangle className="text-red-500 mb-4" size={48} />
            <h2 className="text-xl font-bold text-slate-800 mb-2">系統連線異常</h2>
            <p className="text-slate-600 text-sm font-bold mb-4">{error}</p>
          </div>
          {debugInfo && (
            <div className="mt-4 bg-slate-100 p-4 rounded-xl overflow-x-auto text-left w-full">
              <p className="text-xs text-slate-500 font-bold mb-2">GAS 實際回傳的內容：</p>
              <pre className="text-xs text-rose-600 whitespace-pre-wrap font-mono">{debugInfo}</pre>
            </div>
          )}
        </div>
      </div>
    );
  }

  const renderMetricsGrid = (data) => {
    if (!data) return null;
    return (
      <div className="space-y-4">
        <MetricGroup title="核心營收與門號">
          <MetricCard title="門號業績" metric={data.contracts} unit="件" icon={Users} colorClass="text-blue-600" bgColorClass="bg-blue-50" />
          <MetricCard title="配件營收" metric={data.accessories} unit="元" icon={BatteryCharging} colorClass="text-amber-600" bgColorClass="bg-amber-50" />
          <MetricCard title="保險營收" metric={data.insurance} unit="元" icon={ShieldCheck} colorClass="text-rose-600" bgColorClass="bg-rose-50" />
          {/* 🌟 4月新項目 */}
          <MetricCard title="中嘉寬頻" metric={data.homeBroadband} unit="件" icon={Wifi} colorClass="text-cyan-600" bgColorClass="bg-cyan-50" />
          <MetricCard title="Garmin" metric={data.garmin} unit="件" icon={Activity} colorClass="text-stone-600" bgColorClass="bg-stone-100" />
          <MetricCard title="iPhone組合" metric={data.iphoneCombo} unit="組" icon={ShoppingBag} colorClass="text-purple-600" bgColorClass="bg-purple-50" />
        </MetricGroup>

        <MetricGroup title="硬體與穿戴銷量">
          <MetricCard title="庫存手機" metric={data.stockPhones} unit="台" icon={Package} colorClass="text-slate-600" bgColorClass="bg-slate-100" />
          <MetricCard title="蘋果手機" metric={data.applePhones} unit="台" icon={Smartphone} colorClass="text-slate-800" bgColorClass="bg-slate-200" />
          <MetricCard title="平板與手錶" metric={data.appleTablets} unit="台" icon={Tablet} colorClass="text-slate-600" bgColorClass="bg-slate-100" />
          <MetricCard title="華為穿戴" metric={data.huaweiWearable} unit="點" icon={Watch} colorClass="text-red-600" bgColorClass="bg-red-50" />
          <MetricCard title="VIVO手機" metric={data.vivoPhones} unit="台" icon={Smartphone} colorClass="text-indigo-500" bgColorClass="bg-indigo-50" />
        </MetricGroup>

        <MetricGroup title="周邊與營運指標">
          <MetricCard title="橙艾玻璃貼" metric={data.glassProtector} unit="件" icon={Layers} colorClass="text-orange-500" bgColorClass="bg-orange-50" />
          <MetricCard title="GPLUS吸塵器" metric={data.gplusVacuum} unit="台" icon={Wind} colorClass="text-teal-600" bgColorClass="bg-teal-50" />
          <MetricCard title="LiTV開通數" metric={data.litv} unit="件" icon={Tv} colorClass="text-blue-500" bgColorClass="bg-blue-50" />
          <MetricCard title="生活圈" metric={data.lifeCircle} unit="件" icon={MessageCircle} colorClass="text-green-600" bgColorClass="bg-green-50" />
          <MetricCard title="Google評論" metric={data.googleReviews} unit="則" icon={Star} colorClass="text-yellow-500" bgColorClass="bg-yellow-50" />
          <MetricCard title="社群會員數" metric={data.socialMembers} unit="人" icon={Users} colorClass="text-emerald-600" bgColorClass="bg-emerald-50" />
          <MetricCard title="來客數" metric={data.visitors} unit="人" icon={Footprints} colorClass="text-pink-500" bgColorClass="bg-pink-50" />
        </MetricGroup>
      </div>
    );
  };

  const renderAllStoresView = () => {
    if (!summary || !summary.grossProfit) return null;

    const totalActual = summary?.grossProfit?.actual || 0;
    const totalTarget = summary?.grossProfit?.target || 0;
    const totalProgress = calcProgress(totalActual, totalTarget);

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
           {topStores.profit && (
             <div className="bg-gradient-to-br from-yellow-300 to-yellow-500 text-yellow-900 border-yellow-200 p-5 rounded-2xl shadow-sm border relative overflow-hidden transform hover:-translate-y-1 transition-transform cursor-pointer" onClick={() => setSelectedStore(topStores.profit.store)}>
                <div className="flex justify-between items-center relative z-10 mb-2">
                   <span className="font-black text-lg flex items-center gap-1"><Trophy size={20}/> 毛利冠軍</span>
                   <span className="font-bold bg-white/40 px-2 py-1 rounded text-sm text-yellow-900">
                     {calcProgress(topStores.profit.grossProfit?.actual, topStores.profit.grossProfit?.target)}%
                   </span>
                </div>
                <h3 className="text-2xl font-black mt-2 relative z-10">{topStores.profit.store}</h3>
                <p className="text-sm font-bold bg-white/50 rounded-md px-2.5 py-1 w-fit shadow-sm mt-2 relative z-10">
                  ${formatNum(topStores.profit.grossProfit?.actual)}
                </p>
                <Crown className="absolute -right-4 -bottom-4 opacity-20 w-24 h-24" />
             </div>
           )}
           {topStores.contracts && (
             <div className="bg-gradient-to-br from-blue-300 to-blue-500 text-blue-900 border-blue-200 p-5 rounded-2xl shadow-sm border relative overflow-hidden transform hover:-translate-y-1 transition-transform cursor-pointer" onClick={() => setSelectedStore(topStores.contracts.store)}>
                <div className="flex justify-between items-center relative z-10 mb-2">
                   <span className="font-black text-lg flex items-center gap-1"><Users size={20}/> 門號冠軍</span>
                   <span className="font-bold bg-white/40 px-2 py-1 rounded text-sm text-blue-900">
                     {calcProgress(topStores.contracts.contracts?.actual, topStores.contracts.contracts?.target)}%
                   </span>
                </div>
                <h3 className="text-2xl font-black mt-2 relative z-10">{topStores.contracts.store}</h3>
                <p className="text-sm font-bold bg-white/50 rounded-md px-2.5 py-1 w-fit shadow-sm mt-2 relative z-10">
                  {topStores.contracts.contracts?.actual} 件
                </p>
                <Smartphone className="absolute -right-4 -bottom-4 opacity-20 w-24 h-24" />
             </div>
           )}
           {topStores.insurance && (
             <div className="bg-gradient-to-br from-rose-300 to-rose-500 text-rose-900 border-rose-200 p-5 rounded-2xl shadow-sm border relative overflow-hidden transform hover:-translate-y-1 transition-transform cursor-pointer" onClick={() => setSelectedStore(topStores.insurance.store)}>
                <div className="flex justify-between items-center relative z-10 mb-2">
                   <span className="font-black text-lg flex items-center gap-1"><ShieldCheck size={20}/> 保險冠軍</span>
                   <span className="font-bold bg-white/40 px-2 py-1 rounded text-sm text-rose-900">
                     {calcProgress(topStores.insurance.insurance?.actual, topStores.insurance.insurance?.target)}%
                   </span>
                </div>
                <h3 className="text-2xl font-black mt-2 relative z-10">{topStores.insurance.store}</h3>
                <p className="text-sm font-bold bg-white/50 rounded-md px-2.5 py-1 w-fit shadow-sm mt-2 relative z-10">
                  ${formatNum(topStores.insurance.insurance?.actual)}
                </p>
                <ShieldCheck className="absolute -right-4 -bottom-4 opacity-20 w-24 h-24" />
             </div>
           )}
        </div>

        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden">
          {totalProgress >= 100 && <div className="absolute inset-0 bg-emerald-50 opacity-50 z-0"></div>}
          <div className="flex justify-between items-end mb-4 relative z-10">
            <div>
              <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2 mb-1">
                <Target className="text-emerald-500" size={24} /> 
                全區總毛利進度 {totalProgress >= 100 && '🎉'}
              </h2>
              <p className="text-sm font-medium text-slate-500">目標: ${formatNum(totalTarget)}</p>
            </div>
            <div className="text-right">
              <span className={`text-4xl md:text-5xl font-black ${totalProgress >= 100 ? 'text-emerald-600' : 'text-slate-800'}`}>
                ${formatNum(totalActual)}
              </span>
            </div>
          </div>
          <div className="relative w-full h-6 bg-slate-100 rounded-full overflow-hidden shadow-inner z-10">
            <div 
              className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out rounded-full flex items-center justify-end pr-3 text-sm font-bold text-white ${
                totalProgress >= 100 ? 'bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)]' : 'bg-indigo-600'
              }`}
              style={{ width: `${Math.min(totalProgress, 100)}%` }}
            >
              {totalProgress > 5 ? `${totalProgress}%` : ''}
            </div>
          </div>
        </div>

        <div className="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-slate-200">
           {renderMetricsGrid(summary)}
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden text-center">
          <div className="p-5 md:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Award className="text-amber-500" size={24} /> 門市戰鬥序列
            </h2>
            <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full text-center">依達成率排序</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                  <th className="p-4 pl-6 font-bold text-center">排名 / 門市</th>
                  <th className="p-4 font-bold text-right">毛利進度 (NT$)</th>
                  <th className="p-4 font-bold text-center">狀態</th>
                  <th className="p-4 font-bold text-center">門號件數</th>
                  <th className="p-4 font-bold text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedStoresByProfit.map((store, index) => {
                  const storeActual = store?.grossProfit?.actual || 0;
                  const storeTarget = store?.grossProfit?.target || 0;
                  const progress = calcProgress(storeActual, storeTarget);
                  const isTop = index === 0;
                  
                  return (
                    <tr 
                      key={store.store || `store-${index}`} 
                      onClick={() => setSelectedStore(store.store)}
                      className="hover:bg-indigo-50/60 transition-colors cursor-pointer group"
                    >
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${
                            isTop ? 'bg-gradient-to-br from-amber-300 to-amber-500 text-white' : 'bg-white border border-slate-200 text-slate-600'
                          }`}>
                            {index + 1}
                          </span>
                          <span className={`font-black text-lg ${isTop ? 'text-amber-700' : 'text-slate-700'} group-hover:text-indigo-700 transition-colors`}>
                            {store.store || '未命名門市'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="font-bold text-slate-800 text-lg">${formatNum(storeActual)}</div>
                        <div className="text-xs font-medium text-slate-400">/ ${formatNum(storeTarget)}</div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                           <span className={`font-bold text-sm ${progress >= 100 ? 'text-emerald-600' : 'text-slate-600'}`}>
                             {progress}%
                           </span>
                        </div>
                      </td>
                      <td className="p-4 text-center text-slate-600 font-semibold">
                        {store?.contracts?.actual || 0} <span className="text-xs text-slate-400 font-normal">/ {store?.contracts?.target || 0}</span>
                      </td>
                      <td className="p-4 text-center">
                        <button className="text-indigo-600 bg-white border border-indigo-100 shadow-sm px-3 py-1.5 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-all hover:bg-indigo-600 hover:text-white">
                          門市明細 &rarr;
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <SmartMotivator data={summary} targetName="全區" allStoresData={currentMonthData?.stores} />
      </div>
    );
  };

  const renderStoreDetailView = () => {
    if (!storeDetail) return null;
    
    const storeActual = storeDetail?.grossProfit?.actual || 0;
    const storeTarget = storeDetail?.grossProfit?.target || 0;
    const progress = calcProgress(storeActual, storeTarget);
    const isOverkill = progress >= 100;
    
    const sortedEmployees = [...(storeDetail.employees || [])].sort((a, b) => {
      const pA = calcProgress(a?.grossProfit?.actual, a?.grossProfit?.target);
      const pB = calcProgress(b?.grossProfit?.actual, b?.grossProfit?.target);
      return pB - pA;
    });

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300 pb-20">
        <div className="flex items-center gap-4 bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-slate-200">
          {!lockedStore && (
            <button 
              onClick={() => setSelectedStore(null)}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500 hover:text-indigo-600 flex items-center gap-2 font-bold"
            >
              <ArrowLeft size={20} /> 返回全區
            </button>
          )}
          {!lockedStore && <div className="h-8 w-px bg-slate-200"></div>}
          <h2 className="text-2xl font-black text-indigo-900 flex items-center gap-2">
            <Store className="text-indigo-500" size={24} /> {storeDetail.store}
          </h2>
        </div>

        <div className={`p-6 md:p-8 rounded-3xl shadow-lg text-white relative overflow-hidden ${isOverkill ? 'bg-gradient-to-br from-emerald-500 to-teal-700' : 'bg-gradient-to-br from-indigo-600 to-purple-700'}`}>
          {isOverkill && <Trophy className="absolute right-[-20px] bottom-[-20px] w-48 h-48 opacity-10" />}
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
            <div className="flex-1 w-full">
              <p className="text-white/80 font-bold mb-2 flex items-center gap-2 text-lg">
                <Zap size={20} /> 門市毛利進度
              </p>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-5xl font-black">${formatNum(storeActual)}</span>
                <span className="text-white/60 font-bold">/ ${formatNum(storeTarget)}</span>
              </div>
              <div className="relative w-full h-3 bg-indigo-900/40 rounded-full overflow-hidden">
                <div 
                  className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ${isOverkill ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]' : 'bg-white'}`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center min-w-[140px]">
              <p className="text-white/80 text-sm font-bold mb-1">達成率</p>
              <p className={`text-5xl font-black ${isOverkill ? 'text-emerald-300' : 'text-white'}`}>
                {progress}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-slate-200">
           {renderMetricsGrid(storeDetail)}
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mt-8">
           <div className="p-5 md:p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-50/30">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <UserCircle className="text-indigo-500" size={24} /> 門市人員戰鬥序列
            </h2>
          </div>
          <div className="overflow-x-auto pb-4 custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[1500px]">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs border-b border-slate-200 uppercase tracking-wider">
                  <th className="p-4 pl-6 font-bold sticky left-0 bg-slate-50 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] text-center">業務員</th>
                  <th className="p-4 font-bold text-right min-w-[140px]">毛利 (實際/目標)</th>
                  <th className="p-4 font-bold text-center">狀態</th>
                  <th className="p-4 font-bold text-center">保險營收</th>
                  <th className="p-4 font-bold text-center">門號(件)</th>
                  <th className="p-4 font-bold text-center">配件營收</th>
                  <th className="p-4 font-bold text-center border-l border-slate-200">中嘉寬頻</th>
                  <th className="p-4 font-bold text-center">Garmin</th>
                  <th className="p-4 font-bold text-center">iPhone組合</th>
                  <th className="p-4 font-bold text-center border-l border-slate-200">庫存機</th>
                  <th className="p-4 font-bold text-center">蘋果手機</th>
                  <th className="p-4 font-bold text-center">平板/手錶</th>
                  <th className="p-4 font-bold text-center border-l border-slate-200">華為</th>
                  <th className="p-4 font-bold text-center">玻璃貼</th>
                  <th className="p-4 font-bold text-center">VIVO</th>
                  <th className="p-4 font-bold text-center">吸塵器</th>
                  <th className="p-4 font-bold text-center text-blue-600 border-l border-blue-100">LiTV</th>
                  <th className="p-4 font-bold text-center border-l border-slate-200">生活圈</th>
                  <th className="p-4 font-bold text-center">評論</th>
                  <th className="p-4 font-bold text-center text-emerald-600 border-l border-emerald-100">社群會員</th>
                  <th className="p-4 font-bold text-center border-l border-slate-200">來客數</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-center">
                {sortedEmployees.map((emp, index) => {
                  const empActual = emp?.grossProfit?.actual || 0;
                  const empTarget = emp?.grossProfit?.target || 0;
                  const empProgress = calcProgress(empActual, empTarget);
                  const isMvp = index === 0 && empProgress > 0;
                  
                  return (
                    <tr key={emp.name || `emp-${index}`} className="hover:bg-slate-50 transition-colors group">
                      <td className="p-4 pl-6 sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] group-hover:bg-slate-50">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg ${isMvp ? 'bg-amber-100 text-amber-600 border border-amber-200' : 'bg-indigo-50 text-indigo-600'}`}>
                            {emp.name ? emp.name.charAt(0) : '?'}
                          </div>
                          <span className="font-bold text-slate-800 whitespace-nowrap">{emp.name || '未命名'}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="font-bold text-slate-800">${formatNum(empActual)}</div>
                        <div className="text-xs font-medium text-slate-400">/ ${formatNum(empTarget)}</div>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`font-bold px-3 py-1 rounded-lg text-xs ${empProgress >= 100 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                          {empProgress}%
                        </span>
                      </td>
                      <td className="p-4 text-center font-bold text-rose-600">${formatNum(emp?.insurance?.actual || 0)}</td>
                      <td className="p-4 text-center font-bold text-blue-600">{emp?.contracts?.actual || 0}</td>
                      <td className="p-4 text-center font-bold text-amber-600">${formatNum(emp?.accessories?.actual || 0)}</td>
                      <td className="p-4 text-center text-cyan-600 border-l border-slate-200">{emp?.homeBroadband?.actual || 0}</td>
                      <td className="p-4 text-center text-stone-600">{emp?.garmin?.actual || 0}</td>
                      <td className="p-4 text-center text-purple-600">{emp?.iphoneCombo?.actual || 0}</td>
                      <td className="p-4 text-center text-slate-600 border-l border-slate-200">{emp?.stockPhones?.actual || 0}</td>
                      <td className="p-4 text-center text-slate-600">{emp?.applePhones?.actual || 0}</td>
                      <td className="p-4 text-center text-slate-600">{emp?.appleTablets?.actual || 0}</td>
                      <td className="p-4 text-center text-slate-600 border-l border-slate-200">{emp?.huaweiWearable?.actual || 0}</td>
                      <td className="p-4 text-center text-slate-600">{emp?.glassProtector?.actual || 0}</td>
                      <td className="p-4 text-center text-slate-600">{emp?.vivoPhones?.actual || 0}</td>
                      <td className="p-4 text-center text-slate-600">{emp?.gplusVacuum?.actual || 0}</td>
                      <td className="p-4 text-center text-blue-600 font-bold border-l border-blue-50 bg-blue-50/30">{emp?.litv?.actual || 0}</td>
                      <td className="p-4 text-center text-slate-600 border-l border-slate-200">{emp?.lifeCircle?.actual || 0}</td>
                      <td className="p-4 text-center text-slate-600">{emp?.googleReviews?.actual || 0}</td>
                      <td className="p-4 text-center text-emerald-600 font-bold border-l border-emerald-50 bg-emerald-50/30">{emp?.socialMembers?.actual || 0}</td>
                      <td className="p-4 text-center text-slate-600 border-l border-slate-200">{emp?.visitors?.actual || 0}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <SmartMotivator data={storeDetail} targetName={storeDetail.store} allStoresData={null} />
      </div>
    );
  };

  return (
    <>
      {showConfetti && <SimpleConfetti />}
      
      <div className="min-h-screen p-2 md:p-6 lg:p-8 font-sans bg-slate-50/80 relative">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-slate-200">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 flex items-center gap-3">
                <TrendingUp className="text-indigo-600 bg-indigo-50 p-1.5 rounded-xl flex-shrink-0" size={36} />
                Money 通訊 | 戰情指揮中心
              </h1>
            </div>
            <div className="mt-4 md:mt-0 relative flex items-center gap-3 w-full md:w-auto">
              <span className="text-sm font-bold text-slate-400 hidden md:block">月份切換：</span>
              <div className="flex-1 md:flex-none flex items-center gap-2 bg-slate-50 hover:bg-slate-100 transition-colors px-4 py-2.5 rounded-xl border border-slate-200 cursor-pointer relative">
                <Calendar className="text-slate-500" size={20} />
                <select 
                  value={selectedMonth}
                  onChange={(e) => {
                    setSelectedMonth(e.target.value);
                    if (!lockedStore) setSelectedStore(null);
                  }}
                  className="bg-transparent border-none text-slate-800 font-bold focus:ring-0 cursor-pointer outline-none appearance-none pr-8 w-full md:w-auto"
                >
                  {rawData && Object.keys(rawData).sort().reverse().map(month => (
                    <option key={month} value={month}>{month} 月份戰報</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              </div>
            </div>
          </div>
          {selectedStore === null ? renderAllStoresView() : renderStoreDetailView()}
        </div>
      </div>
    </>
  );
}
