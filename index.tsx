import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

const TARGET_URL = "https://laundry.senkaq.com/shop/osaka/osaka-shi-ikuno-ku/4710/";

// Vocabulary for translations
type Vocab = {
  hello: string;
  remaining_prefix: string; // "Ends in"
  available: string;
  washer: string;
  dryer: string;
  washer_dryer: string;
  sneaker_washer: string;
  sneaker_dryer: string;
  shoe: string; // Generic shoe term if needed
  min: string;
  calculating: string;
  finished: string;
  in_use: string;
  error: string;
};

// Supported Languages with Dictionary
const LANGUAGES: { code: string; name: string; flag: string; vocab: Vocab }[] = [
  { 
    code: "en", 
    name: "English", 
    flag: "🇺🇸", 
    vocab: {
      hello: "Check Availability",
      remaining_prefix: "Ends in",
      available: "Available",
      washer: "Washer",
      dryer: "Dryer",
      washer_dryer: "Washer/Dryer",
      sneaker_washer: "Shoe Washer",
      sneaker_dryer: "Shoe Dryer",
      shoe: "Shoe Machine",
      min: "min",
      calculating: "Calc...",
      finished: "Finished",
      in_use: "In Use",
      error: "Error"
    }
  },
  { 
    code: "zh-CN", 
    name: "简体中文", 
    flag: "🇨🇳", 
    vocab: {
      hello: "检查可用性",
      remaining_prefix: "剩余",
      available: "空闲",
      washer: "洗衣机",
      dryer: "烘干机",
      washer_dryer: "洗烘一体机",
      sneaker_washer: "洗鞋机",
      sneaker_dryer: "烘鞋机",
      shoe: "洗鞋设备",
      min: "分",
      calculating: "计算中...",
      finished: "已完成",
      in_use: "使用中",
      error: "故障"
    }
  },
  { 
    code: "zh-TW", 
    name: "繁體中文", 
    flag: "🇹🇼", 
    vocab: {
      hello: "檢查可用性",
      remaining_prefix: "剩餘",
      available: "空閒",
      washer: "洗衣機",
      dryer: "烘乾機",
      washer_dryer: "洗烘一體機",
      sneaker_washer: "洗鞋機",
      sneaker_dryer: "烘鞋機",
      shoe: "洗鞋設備",
      min: "分",
      calculating: "計算中...",
      finished: "已完成",
      in_use: "使用中",
      error: "故障"
    }
  },
  { 
    code: "ko", 
    name: "한국어", 
    flag: "🇰🇷", 
    vocab: {
      hello: "사용 가능 여부 확인",
      remaining_prefix: "남은 시간",
      available: "사용 가능",
      washer: "세탁기",
      dryer: "건조기",
      washer_dryer: "세탁건조기",
      sneaker_washer: "운동화 세탁기",
      sneaker_dryer: "운동화 건조기",
      shoe: "운동화 전용",
      min: "분",
      calculating: "계산 중...",
      finished: "종료",
      in_use: "사용 중",
      error: "고장"
    }
  },
  { 
    code: "ja", 
    name: "日本語", 
    flag: "🇯🇵", 
    vocab: {
      hello: "空き状況を確認",
      remaining_prefix: "あと",
      available: "空き",
      washer: "洗濯機",
      dryer: "乾燥機",
      washer_dryer: "洗濯乾燥機",
      sneaker_washer: "スニーカー洗濯機",
      sneaker_dryer: "スニーカー乾燥機",
      shoe: "スニーカーランドリー",
      min: "分",
      calculating: "計算中...",
      finished: "運転終了",
      in_use: "運転中",
      error: "故障"
    }
  },
  { 
    code: "vi", 
    name: "Tiếng Việt", 
    flag: "🇻🇳", 
    vocab: {
      hello: "Kiểm tra tình trạng",
      remaining_prefix: "Còn",
      available: "Có sẵn",
      washer: "Máy giặt",
      dryer: "Máy sấy",
      washer_dryer: "Máy giặt sấy",
      sneaker_washer: "Máy giặt giày",
      sneaker_dryer: "Máy sấy giày",
      shoe: "Máy giày",
      min: "phút",
      calculating: "Đang tính...",
      finished: "Đã xong",
      in_use: "Đang chạy",
      error: "Lỗi"
    }
  },
  { 
    code: "th", 
    name: "ไทย", 
    flag: "🇹🇭", 
    vocab: {
      hello: "ตรวจสอบสถานะ",
      remaining_prefix: "เหลือ",
      available: "ว่าง",
      washer: "เครื่องซักผ้า",
      dryer: "เครื่องอบผ้า",
      washer_dryer: "เครื่องซักอบ",
      sneaker_washer: "เครื่องซักรองเท้า",
      sneaker_dryer: "เครื่องอบรองเท้า",
      shoe: "เครื่องซักรองเท้า",
      min: "นาที",
      calculating: "กำลังคำนวณ...",
      finished: "เสร็จสิ้น",
      in_use: "กำลังทำงาน",
      error: "ข้อผิดพลาด"
    }
  },
  { 
    code: "fr", 
    name: "Français", 
    flag: "🇫🇷", 
    vocab: {
      hello: "Vérifier la disponibilité",
      remaining_prefix: "Fin dans",
      available: "Libre",
      washer: "Lave-linge",
      dryer: "Sèche-linge",
      washer_dryer: "Lavant-séchant",
      sneaker_washer: "Lave-chaussures",
      sneaker_dryer: "Sèche-chaussures",
      shoe: "Machine chaussures",
      min: "min",
      calculating: "Calc...",
      finished: "Terminé",
      in_use: "En cours",
      error: "Erreur"
    }
  },
];

type MachineData = {
  id: string;
  rawType: string;
  rawStatus: string;
  rawCapacity: string;
  isAvailable: boolean;
  remainingMinutes?: number;
};

const App = () => {
  // Helper to detect browser language
  const getBrowserLanguage = () => {
    if (typeof navigator === 'undefined') return 'en';
    const lang = navigator.language;
    
    // Exact match (e.g., 'zh-CN')
    const exactMatch = LANGUAGES.find(l => l.code === lang);
    if (exactMatch) return exactMatch.code;

    // Partial match (e.g., 'ja-JP' -> 'ja')
    const shortCode = lang.split('-')[0];
    const codeMatch = LANGUAGES.find(l => l.code === shortCode);
    if (codeMatch) return codeMatch.code;

    // Fallback logic for Chinese variations if exact match fails but 'zh' exists
    if (shortCode === 'zh') {
       if (lang.toLowerCase().includes('tw') || lang.toLowerCase().includes('hk')) return 'zh-TW';
       return 'zh-CN';
    }

    return 'en';
  };

  const [language, setLanguage] = useState(getBrowserLanguage);
  const [loading, setLoading] = useState(false);
  const [machines, setMachines] = useState<MachineData[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);

  // Helper to get vocab based on language
  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];
  const vocab = currentLang.vocab;

  // --- NEW PARSING LOGIC: Heuristic Scoring Strategy ---
  const parseLaundryHTML = (html: string): MachineData[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const foundMachines: MachineData[] = [];
    const processedIds = new Set<string>();

    // Helper: Extract text including IMG alt tags, IMG src keywords, and Class names
    const getRichText = (el: Element): string => {
      let text = "";
      
      // 1. Process Attributes (Alt, Src, Class)
      const alt = el.getAttribute("alt") || "";
      const src = (el.getAttribute("src") || "").toLowerCase();
      const className = (el.getAttribute("class") || "").toLowerCase();
      
      text += ` ${alt} ${className} `;
      
      // Analyze Image Source/Class for Hidden Semantics (Common Japanese web patterns)
      if (src.includes("vacant") || src.includes("aki") || src.includes("ok") || src.includes("open") || className.includes("available")) text += " Available ";
      if (src.includes("working") || src.includes("unten") || src.includes("use") || src.includes("busy") || src.includes("running") || className.includes("busy")) text += " In Use ";
      if (src.includes("stop") || src.includes("end") || src.includes("finish")) text += " Finished ";
      
      if (src.includes("sentaku") || src.includes("wash") || className.includes("wash")) text += " Washer ";
      if (src.includes("kansou") || src.includes("dry") || className.includes("dry")) text += " Dryer ";
      if (src.includes("kutsu") || src.includes("shoe") || className.includes("shoe")) text += " Sneaker ";

      // 2. Process Children
      el.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          text += (node.textContent || "") + " ";
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const childEl = node as Element;
          if (!["SCRIPT", "STYLE", "NOSCRIPT"].includes(childEl.tagName)) {
             text += getRichText(childEl);
          }
        }
      });

      // Clean up spaces
      return text.replace(/\s+/g, " ");
    };

    // Candidate Search: Find all potential machine cards
    const candidates = Array.from(doc.querySelectorAll("div, li, tr, article, dl, section, td"));
    
    // Patterns
    const idPattern = /(?:No\.|#|号機|^|\s)(\d{1,2})(?:\s|$|号|番)/i;
    const typePattern = /洗濯|乾燥|Wash|Dry|Sneaker|Shoes|スニーカー/i;
    // Status indicators: Keywords or Time pattern
    const statusPattern = /空き|Available|空室|利用可|運転中|稼働中|In Use|終了|Finished|残り|あと|Remaining|min|分/i;

    const scoredCandidates: { el: Element, text: string, score: number, id: string }[] = [];

    candidates.forEach(el => {
      // Pre-filter huge containers to avoid processing body/main
      if (el.innerHTML.length > 2000) return;

      const text = getRichText(el).trim();
      let score = 0;
      let id = "";

      // 1. Check ID
      const idMatch = text.match(idPattern);
      if (idMatch) {
        id = idMatch[1];
        score += 10;
      } else {
        return; // No ID, not a machine
      }

      // 2. Check Type
      if (typePattern.test(text)) score += 5;

      // 3. Check Status (or Time)
      if (statusPattern.test(text)) score += 5;
      
      // 4. Penalty for length (shorter is more likely a specific card)
      score -= Math.min(text.length / 100, 5);

      if (score >= 10) { // Threshold: At least an ID found
         scoredCandidates.push({ el, text, score, id });
      }
    });

    // Sort by score (descending) then by length (ascending)
    scoredCandidates.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.text.length - b.text.length;
    });

    scoredCandidates.forEach(({ text, id }) => {
      if (processedIds.has(id)) return;

      // Found a new machine candidate
      let rawType = "washer"; 
      let rawStatus = "Unknown";
      let isAvailable = false;
      let remainingMinutes: number | undefined = undefined;

      // Extract Status
      // Check for time first (Strongest signal for In Use)
      const timeMatch = text.match(/(?:残り|あと|Remaining)?\s*[:：]?\s*(\d+)\s*(?:分|min)/i);
      
      if (timeMatch) {
        remainingMinutes = parseInt(timeMatch[1], 10);
        isAvailable = false;
        rawStatus = "In Use";
      } else if (/空き|Available|空室|利用可|Vacant/i.test(text)) {
        isAvailable = true;
        rawStatus = "Available";
      } else if (/運転中|稼働中|In Use|Running|Driving/i.test(text)) {
        isAvailable = false;
        rawStatus = "In Use";
      } else if (/終了|Finished|Stop/i.test(text)) {
        isAvailable = false;
        rawStatus = "Finished";
      } else if (/故障|Error|Out of order/i.test(text)) {
        isAvailable = false;
        rawStatus = "Error";
      } else {
        // Fallback:
        // If we found a valid ID but NO time and NO specific "In Use" keywords, 
        // it is highly likely the machine is Available (idle state often has less text).
        // Defaulting to "In Use" causes empty machines to look busy.
        isAvailable = true;
        rawStatus = "Available";
      }

      // Extract Type
      if (/洗濯乾燥|Washer.*Dryer|洗乾/i.test(text)) rawType = "washer_dryer";
      else if (/スニーカー|Shoe/i.test(text)) {
        if (/乾燥|Dry/i.test(text)) rawType = "sneaker_dryer";
        else rawType = "sneaker_washer";
      }
      else if (/乾燥|Dry/i.test(text)) rawType = "dryer";
      else if (/洗濯|Wash/i.test(text)) rawType = "washer";

      // Extract Capacity
      const capMatch = text.match(/(\d+kg)/i);
      const rawCapacity = capMatch ? capMatch[1] : "";

      foundMachines.push({
        id,
        rawType,
        rawStatus,
        rawCapacity,
        isAvailable,
        remainingMinutes
      });

      processedIds.add(id);
    });

    return foundMachines.sort((a, b) => parseInt(a.id) - parseInt(b.id));
  };

  const handleFetchStatus = async () => {
    setLoading(true);
    setError(null);
    setMachines(null);
    setDebugInfo(null);
    
    let content = "";
    let fetchSuccess = false;

    // Define strategies to fetch content to handle "Failed to fetch" errors gracefully
    const proxies = [
      {
        // Strategy 1: CORSProxy.io (Very reliable for basic sites)
        name: "CORSProxy.io",
        url: `https://corsproxy.io/?${encodeURIComponent(TARGET_URL)}`,
        fetch: async (url: string) => {
          const res = await fetch(url);
          if (!res.ok) throw new Error(`Status ${res.status}`);
          return await res.text();
        }
      },
      {
        // Strategy 2: CodeTabs (Returns raw HTML - Best for scraping)
        name: "CodeTabs",
        url: `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(TARGET_URL)}`,
        fetch: async (url: string) => {
          const res = await fetch(url);
          if (!res.ok) throw new Error("Status " + res.status);
          return await res.text();
        }
      },
      {
        // Strategy 3: AllOrigins (Returns JSON with content field - Backup)
        name: "AllOrigins",
        url: `https://api.allorigins.win/get?url=${encodeURIComponent(TARGET_URL)}&timestamp=${Date.now()}`,
        fetch: async (url: string) => {
          const res = await fetch(url);
          if (!res.ok) throw new Error("Status " + res.status);
          const json = await res.json();
          if (!json.contents) throw new Error("Empty contents");
          return json.contents;
        }
      }
    ];

    try {
      // Iterate through proxies until one works
      for (const proxy of proxies) {
        try {
          console.log(`Trying proxy: ${proxy.name}`);
          content = await proxy.fetch(proxy.url);
          
          if (content && content.length > 500) {
            fetchSuccess = true;
            // Capture HTML title for debug
            const titleMatch = content.match(/<title>(.*?)<\/title>/i);
            const title = titleMatch ? titleMatch[1] : "No Title";
            setDebugInfo(`Fetched via ${proxy.name}. Length: ${content.length} chars. Title: ${title}`);
            break; // Stop if successful
          }
        } catch (e: any) {
          console.warn(`Proxy ${proxy.name} failed:`, e);
          setDebugInfo(prev => (prev || "") + `\n${proxy.name} Failed: ${e.message}`);
          // Continue to next proxy
        }
      }

      if (!fetchSuccess) {
        throw new Error("All proxies failed to access the site. The site might be blocking access.");
      }
      
      const parsedData = parseLaundryHTML(content);
      
      if (parsedData.length === 0) {
        // Fallback check for typical "Enable JS" or "Blocked" messages
        if (content.length < 500 && content.includes("JavaScript")) {
           throw new Error("This laundry site requires JavaScript and cannot be auto-read.");
        }
        
        console.warn("Raw content length:", content.length);
        throw new Error("Connected to site, but could not find machine data. Layout might be dynamic (JS-only).");
      }

      setMachines(parsedData);
      setLastUpdated(new Date().toLocaleTimeString());
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Unable to auto-read status. Please verify manually.");
    } finally {
      setLoading(false);
    }
  };

  // Translation Helper
  const getTranslatedType = (rawType: string): string => {
    switch (rawType) {
      case "washer": return vocab.washer;
      case "dryer": return vocab.dryer;
      case "washer_dryer": return vocab.washer_dryer;
      case "sneaker_washer": return vocab.sneaker_washer;
      case "sneaker_dryer": return vocab.sneaker_dryer;
      default: return vocab.washer; // Fallback
    }
  };

  const getTranslatedCapacity = (cap: string): string => {
    if (!cap) return "";
    return cap; 
  };

  return (
    <div className="min-h-screen font-sans bg-gray-50 text-gray-800 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2 text-blue-600">
            <i className="fa-solid fa-soap text-2xl"></i>
            <h1 className="font-bold text-lg tracking-tight">Laundry Viewer</h1>
          </div>
          
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fa-solid fa-earth-americas text-blue-500"></i>
            </div>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="appearance-none bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold rounded-full pl-9 pr-8 py-2 text-sm border border-blue-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
            >
              {LANGUAGES.map(l => (
                <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-blue-400">
              <i className="fa-solid fa-chevron-down text-xs"></i>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-md mx-auto w-full p-4 space-y-6 flex flex-col">
        
        {/* Welcome Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-50 text-center space-y-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto text-blue-600">
            <i className="fa-solid fa-shirt text-3xl"></i>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Senkaq Laundry</h2>
            <p className="text-sm text-gray-500 mt-1">Osaka Ikuno-ku</p>
          </div>
          
          <button 
            onClick={handleFetchStatus}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-lg font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <div className="loader border-white border-t-transparent"></div>
                <span>Checking...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-magnifying-glass"></i>
                <span>{vocab.hello}</span>
              </>
            )}
          </button>
          
          {loading && (
            <p className="text-xs text-gray-400 animate-pulse">
              Connecting to laundry system...
            </p>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm border border-red-100 text-center animate-fade-in">
            <p className="mb-3 font-bold"><i className="fa-solid fa-circle-exclamation mr-1"></i> Check Failed</p>
            <p className="text-xs mb-3 opacity-90">{error}</p>
            <div className="flex flex-col gap-2">
              <a 
                href={TARGET_URL} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-white text-red-600 border border-red-200 px-5 py-2 rounded-lg font-bold shadow-sm hover:bg-red-50 text-sm"
              >
                Open Official Site
              </a>
              <button 
                onClick={() => setShowDebug(!showDebug)}
                className="text-xs text-red-400 underline decoration-dotted"
              >
                {showDebug ? "Hide Debug Info" : "Show Debug Info"}
              </button>
              {showDebug && debugInfo && (
                <pre className="text-[10px] text-left bg-gray-100 p-2 rounded overflow-x-auto whitespace-pre-wrap">
                  {debugInfo}
                </pre>
              )}
            </div>
          </div>
        )}

        {/* Results Grid */}
        {machines && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-end px-1">
              <h3 className="font-bold text-gray-700 text-lg">Live Status</h3>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                Updated: {lastUpdated}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {machines.map((machine, idx) => {
                const isDryer = machine.rawType.includes("dryer");
                const isWasher = machine.rawType.includes("washer");
                const isSneaker = machine.rawType.includes("sneaker");
                
                let iconClass = "fa-soap";
                if (isSneaker) iconClass = "fa-shoe-prints";
                else if (isDryer && !isWasher) iconClass = "fa-wind"; 
                else if (isDryer && isWasher) iconClass = "fa-layer-group";

                const translatedType = getTranslatedType(machine.rawType);
                const translatedCapacity = getTranslatedCapacity(machine.rawCapacity);

                return (
                  <div 
                    key={idx} 
                    className={`relative rounded-xl p-4 flex flex-col justify-between min-h-[140px] transition-all duration-300 ${
                      machine.isAvailable 
                        ? "bg-white border-2 border-green-100 shadow-sm hover:shadow-md hover:border-green-300" 
                        : "bg-gray-50 border-2 border-transparent opacity-90"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-xs font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                        #{machine.id}
                      </span>
                      {machine.isAvailable ? (
                        <span className="flex h-3 w-3 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                      ) : (
                        <span className="h-2 w-2 rounded-full bg-red-400"></span>
                      )}
                    </div>

                    <div className="text-center my-2">
                      <i className={`fa-solid ${iconClass} text-3xl mb-1 ${machine.isAvailable ? "text-blue-500" : "text-gray-400"}`}></i>
                      <div className="text-xs font-bold text-gray-600 leading-tight line-clamp-2">
                        {translatedType}
                      </div>
                      {translatedCapacity && <div className="text-[10px] text-gray-400 mt-0.5">{translatedCapacity}</div>}
                    </div>

                    <div className={`text-center text-sm font-bold rounded py-1 ${
                      machine.isAvailable 
                        ? "text-green-600 bg-green-50" 
                        : (machine.rawStatus === "Error" ? "text-gray-500 bg-gray-200" : "text-red-500 bg-red-50")
                    }`}>
                      {machine.isAvailable ? (
                        <span>{vocab.available}</span> 
                      ) : (
                        machine.remainingMinutes !== undefined ? (
                          <span className="flex flex-col sm:flex-row items-center justify-center gap-1 text-xs leading-tight">
                            <span className="opacity-80 font-medium whitespace-nowrap">{vocab.remaining_prefix}</span>
                            <span className="whitespace-nowrap">{machine.remainingMinutes} {vocab.min}</span>
                          </span>
                        ) : (
                          // Fallback if no specific time found but not available
                          <span>{machine.rawStatus === "Finished" ? vocab.finished : (machine.rawStatus === "Error" ? vocab.error : vocab.in_use)}</span>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer info for guest */}
        <div className="text-center pt-8 pb-4">
           <a 
            href={TARGET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-blue-500 transition underline decoration-dotted"
           >
             Source: laundry.senkaq.com
           </a>
        </div>

      </main>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<App />);