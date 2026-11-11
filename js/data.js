// 佛光大學 應用科技與設計學院 3D 互動島嶼資料核心
// 資料來源參考：https://tech.fgu.edu.tw/?locale=zh_tw

const COLLEGE_INFO = {
  name: "佛光大學 應用科技與設計學院",
  engName: "College of Applied Technology and Design, FGU",
  motto: "科技賦能 ‧ 設計創價 ‧ 跨域學習 ‧ 溫暖同行",
  officialUrl: "https://tech.fgu.edu.tw/?locale=zh_tw",
  description: "結合資訊應用科技、數位媒體傳播、產品設計與建築環境規劃，培育具備人本關懷與前瞻創造力之新世代數位人才。"
};

const ISLANDS_DATA = [
  {
    id: "central",
    name: "學院總部・學習大廣場",
    subtitle: "全院核心 ‧ 跨域交流與學習樞紐",
    deptCode: "COLLEGE",
    coords: [0, 0, 0],
    color: "#F59E0B",
    accentColor: "#FEF3C7",
    textColor: "#92400E",
    tag: "跨域樞紐",
    hexRadius: 8.5,
    elevation: 0.6,
    mayor: {
      id: "mayor_owl",
      name: "院長・奧爾博",
      species: "智慧金角貓頭鷹",
      avatarEmoji: "🦉",
      role: "應用科技與設計學院 院長",
      quote: "歡迎來到學習群島！科技是翅膀，設計是靈魂，願每位島民在此翱翔。",
      color: "#F59E0B",
      bio: "擁有三百多年博學智慧的貓頭鷹院長，總是戴著學者金絲眼鏡與博士帽，熱愛在晨曦中巡視五大群島，為迷茫的求學者指引方向。",
      dialogues: {
        intro: "同學，你好呀！我是學院總島的奧爾博院長。今天想探索哪座專業小島？隨時跟我聊聊，我會為你解讀最新的學院情報與跨域指南！",
        news: "【最新院務動態】114學年度起，我們正式更名為「應用科技與設計學院」！同時，2026 佛光盃跨領域科技競賽與碩士班甄試現正熱烈報名中，歡迎發揮跨域實力！",
        curriculum: "【跨域學習地圖】在本學院，你可以自由選修資應系的程式AI、產媒系的造形工藝、傳播系的自媒體敘事，以及建築學程的空間美學，修滿專長學程還能獲頒微學程證書！",
        quest: "【今日學習任務】試著操控你的大學生小人，探索群島尋找隱藏的金色寶箱，並開啟番茄鐘讓自己專注自習 25 分鐘吧！",
        secret: "【院長私房心事】偷偷告訴你，每到深夜，各島的島長們都會在中央噴泉旁喝熱可可開秘密讀書會呢……"
      }
    },
    landmarks: [
      { name: "知識鐘樓", desc: "學院歷史與時間守護地標" },
      { name: "啟發噴泉", desc: "思想交匯湧現的清涼水景" },
      { name: "學思階梯", desc: "陽光灑落的開放自習看台" }
    ],
    announcements: [
      { id: "c1", title: "🎉 學院正式邁入新紀元：創意與科技學院更名為「應用科技與設計學院」", date: "2026/08/01", tag: "院級重要公告", pinned: true },
      { id: "c2", title: "🏆 2026 佛光盃跨領域創意科技競賽正式開跑！總獎金高達20萬元", date: "2026/10/15", tag: "競賽盛事", pinned: true },
      { id: "c3", title: "📢 115學年度碩士班甄試入學招生簡章公告，歡迎跨領域優秀學子報考", date: "2026/11/02", tag: "招生快訊", pinned: false },
      { id: "c4", title: "🌟 跨院微學程成果發表暨自造者嘉年華將於下週五於中央廣場登場", date: "2026/11/08", tag: "學術活動", pinned: false }
    ]
  },
  {
    id: "it",
    name: "資訊應用科技島",
    subtitle: "資訊應用學系 / 學組 ‧ AI與智慧系統",
    deptCode: "IT",
    coords: [-16, 0, -9.5],
    color: "#38BDF8",
    accentColor: "#E0F2FE",
    textColor: "#0369A1",
    tag: "AI ‧ 軟體 ‧ 物聯網",
    hexRadius: 7.5,
    elevation: 0.5,
    mayor: {
      id: "mayor_shiba",
      name: "系主任・柴克",
      species: "工程機械柴犬博士",
      avatarEmoji: "🐕‍🦺",
      role: "資訊應用學系 系主任",
      quote: "寫出優雅的程式碼，就像蓋一座堅固的六角堡壘！Debug 也是一種修行。",
      color: "#38BDF8",
      bio: "熱血十足的程式架構專家柴犬，背著充滿發光量子線圈的小背包。信奉「只要縮排漂亮，程式就不會 Crash」的神奇教義。",
      dialogues: {
        intro: "汪！同學，歡迎來到資訊應用島！這裡充斥著高速運算的算力香氣。你今天也是來寫演算法、訓練 AI 模型，還是想做一款超棒的獨立遊戲？",
        news: "【資應系捷報】賀本系師生團隊榮獲全國大專校院資訊應用服務創新競賽一等獎！另外，下週三我們將舉辦「LLM Agent 開發與部署實戰營」，千萬別錯過！",
        curriculum: "【核心專業領域】我們涵蓋人工智慧、行動物聯網、多媒體遊戲引擎、雲端運算架構四大支柱，並於115學年度新設「人工智慧技術與應用學士學位學程」！",
        quest: "【今日編程挑戰】寫一支 Hello World，或者到便利貼看板發表你最近最想嘗試的技術關鍵字，說不定能找到一起做畢業專題的黑客松隊友！",
        secret: "【柴克的私房秘技】如果遇到怎麼找都找不出的 Bug，不妨輕輕拍拍螢幕三次，然後大喊一聲「柴柴保佑」，保證……還是得看 Console Log 啦！"
      }
    },
    landmarks: [
      { name: "量子伺服矩陣塔", desc: "晝夜運算著高強度 AI 模型的霓虹立方體" },
      { name: "光纖草坪", desc: "閃爍著資料傳輸微光的六角步道" },
      { name: "機甲工作屋", desc: "充滿機械手臂與感測器的硬體實驗室" }
    ],
    announcements: [
      { id: "i1", title: "🥇 賀！資應系師生團隊勇奪全國大專資訊應用服務創新競賽雙料首獎！", date: "2026/11/04", tag: "榮譽榜", pinned: true },
      { id: "i2", title: "💡 【科技工作坊】生成式 AI 與在地智慧農業實作體驗營開放報名", date: "2026/10/28", tag: "研習講座", pinned: false },
      { id: "i3", title: "🤖 115學年度新設「人工智慧技術與應用學士學位學程」師資與實驗室亮點", date: "2026/10/18", tag: "新設學程", pinned: false }
    ]
  },
  {
    id: "design",
    name: "產品與媒體設計島",
    subtitle: "產品與媒體設計學系 / 學組 ‧ 創客與工藝",
    deptCode: "DESIGN",
    coords: [16, 0, -9.5],
    color: "#FB7185",
    accentColor: "#FFE4E6",
    textColor: "#9F1239",
    tag: "3D造形 ‧ 工業設計 ‧ 視覺傳達",
    hexRadius: 7.5,
    elevation: 0.5,
    mayor: {
      id: "mayor_fox",
      name: "總監・菲奈克",
      species: "彩釉羽耳赤狐",
      avatarEmoji: "🦊",
      role: "產品與媒體設計學系 創意總監",
      quote: "設計不是裝飾，而是讓生活更溫柔的魔法。你的想像力就是微縮世界！",
      color: "#FB7185",
      bio: "擁有一雙巨大彩釉漸層耳與靈巧雙手的赤狐設計師。擅長觀察光影質地，口袋裡永遠裝著色票、鉛筆與微型 3D 列印公仔。",
      dialogues: {
        intro: "嗨，旅行者！歡迎來到充滿靈感火花的設計島！深呼吸，你有聞到新鮮黏土與 3D 列印樹脂的香味嗎？在這裡，任何天馬行空的草圖都能化為實體！",
        news: "【設計大展前瞻】本系年度畢業設計展「微光縮影」即將於台北松菸盛大展出！另外國際紅點設計獎（Red Dot）得獎團隊將於週五帶來沙龍分享！",
        curriculum: "【設計專業航道】我們融合「產品工業設計」、「多媒體視覺傳達」與「文創工藝造形」，系上配備五軸 CNC、高精度 3D 列印機與專業木工模型工坊！",
        quest: "【今日美感任務】觀察周遭一樣你最喜愛的生活小物，思考如果將它微縮成玩具模型，你會賦予它什麼材質與溫暖色彩？",
        secret: "【菲奈克的小秘密】其實我尾巴上的漸層毛色不是染的，是某次在工坊熬夜打樣噴漆時不小心噴到的，沒想到意外成為標誌性造型呢！"
      }
    },
    landmarks: [
      { name: "3D 打樣造型所", desc: "微縮模型與概念車殼誕生的造物工坊" },
      { name: "靈感巨鉛筆雕塑", desc: "紀念純粹手繪創意的精神地標" },
      { name: "多面體展覽館", desc: "展示歷代國內外獲獎作品的水晶幾何展廳" }
    ],
    announcements: [
      { id: "d1", title: "🎨 114學年度產媒系畢業成果展《微光縮影》松山文創園區展期公告", date: "2026/11/05", tag: "展覽盛典", pinned: true },
      { id: "d2", title: "✨ 德國紅點設計獎（Red Dot Award）捷報：產媒系團隊再獲概念設計大獎！", date: "2026/10/22", tag: "國際大獎", pinned: true },
      { id: "d3", title: "🛠️ 創客自造中心（Maker Space）引進全新光固化 3D 列印機借用考核開放", date: "2026/10/12", tag: "工坊快報", pinned: false }
    ]
  },
  {
    id: "comm",
    name: "數位傳播與新媒體島",
    subtitle: "傳播學系 / 學組 ‧ 影音自媒體與公關",
    deptCode: "COMM",
    coords: [-16, 0, 14],
    color: "#FBBF24",
    accentColor: "#FEF3C7",
    textColor: "#92400E",
    tag: "影音創作 ‧ 播客 ‧ 新聞公關",
    hexRadius: 7.5,
    elevation: 0.5,
    mayor: {
      id: "mayor_parrot",
      name: "主播・帕洛特",
      species: "彩虹麥克風金剛鸚鵡",
      avatarEmoji: "🦜",
      role: "傳播學系 首席主播",
      quote: "鏡頭推近、麥克風就位！用好故事跨越孤島，把佛光的聲音傳遞給全世界！",
      color: "#FBBF24",
      bio: "羽毛絢麗、語速極快的資深媒體鸚鵡，身上配備著微型防風麥克風與提詞螢幕。熱衷於挖掘校園各個角落的動人故事。",
      dialogues: {
        intro: "3、2、1，On Air！哈囉大家好，我是傳播島的帕洛特主播！你現在收聽的是佛光應用科技與設計學院的第一手現場報導！有什麼獨家新聞想跟我分享嗎？",
        news: "【傳播快報】傳播系學生自製微電影入選新世代青年影展！同時，佛光校園 Podcast「FGU Voice」全新第三季主持人海選開跑囉！",
        curriculum: "【全方位傳播力】從電視影音棚拍、空拍紀錄片、新媒體社群短影音行銷，到公共關係與議題倡議，我們培養最能打動人心的跨平台傳播人！",
        quest: "【今日採訪任務】用 30 秒的句子向身邊的朋友介紹一件你今天感到幸福的事，練習你的口語表達感染力！",
        secret: "【帕洛特的錄音花絮】有一次在全校直播時我打了一個大嗝，當下我立刻裝作是即時音效『咕嚕』，結果觀眾竟然刷了一整排可愛～太驚險了！"
      }
    },
    landmarks: [
      { name: "天線信號鐵塔", desc: "發射高畫質影音與 Podcast 訊號的紅色迷你通訊塔" },
      { name: "微光露天放映幕", desc: "學生原創微電影首映的星空草坪劇院" },
      { name: "音波調音台草地", desc: "高低起伏如等化器音柱的可愛步道" }
    ],
    announcements: [
      { id: "cm1", title: "🎬 賀傳播系微電影《山間回聲》榮獲金穗獎學生組最佳劇本提名", date: "2026/11/06", tag: "影視榮譽", pinned: true },
      { id: "cm2", title: "🎙️ 佛光網路電台 FGU Podcast 新季錄製招募：招募企劃、剪輯與聲優！", date: "2026/10/30", tag: "社群招募", pinned: false },
      { id: "cm3", title: "📹 4K 專業影音攝影棚與雙人錄音間本學期借用須知及實名認證制度", date: "2026/10/05", tag: "設備借用", pinned: false }
    ]
  },
  {
    id: "arch",
    name: "建築環境與空間景觀島",
    subtitle: "建築環境設計學士學位學程 ‧ 永續空間",
    deptCode: "ARCH",
    coords: [16, 0, 14],
    color: "#34D399",
    accentColor: "#D1FAE5",
    textColor: "#065F46",
    tag: "綠建築 ‧ 空間景觀 ‧ 數位構築",
    hexRadius: 7.5,
    elevation: 0.5,
    mayor: {
      id: "mayor_capybara",
      name: "匠師・卡皮",
      species: "慢活柚子水豚建築師",
      avatarEmoji: "🦫",
      role: "建築環境設計學程 首席規劃師",
      quote: "慢慢蓋、仔細雕。最好的建築，是能與山林、光線和小生物溫柔共存的空間。",
      color: "#34D399",
      bio: "頭頂常頂著一顆幸運小橘子、神情安詳的水豚建築師。擅長木質榫卯構造與生態永續評估，走路慢吞吞，但手作的模型每一毫米都精準無比。",
      dialogues: {
        intro: "呼……曬太陽真舒服呀。同學，歡迎來到建築環境島。請隨意坐在木質廊道上，感受風穿過欄杆的流動。你想聊聊空間、光線，還是木工模型呢？",
        news: "【綠建築捷報】本學程學生團隊在全國綠色永續空間設計競賽中榮獲優等！另外，下個月我們將前往礁溪在地社區進行社區營造實地走讀！",
        curriculum: "【空間構築學程】我們著重綠建築設計、空間數位參數化建模（Rhino/Grasshopper）、景觀生態規劃以及實體 1:1 木構造實作構築體驗！",
        quest: "【今日空間冥想】抬頭看看你所在的房間或教室，試著找出一個光線最美的角落，思考窗戶與空間的角度是怎麼形成的！",
        secret: "【卡皮的慢活哲學】大家常問我頭上的橘子為什麼不會掉？因為這是一顆對結構力學極有天份的平衡橘子，也是我建築靈感的來源唷。"
      }
    },
    landmarks: [
      { name: "榫卯木構天幕", desc: "展現傳統木作與現代幾何美學的拱型展架" },
      { name: "生態階梯水苑", desc: "循環過濾山泉水與種植綠植的微縮親水階梯" },
      { name: "景觀風向儀", desc: "隨微風緩緩轉動的木質雕刻風標" }
    ],
    announcements: [
      { id: "a1", title: "🌿 賀！建築學程團隊榮獲臺灣綠建築永續新人獎「年度最佳環境共生獎」", date: "2026/11/07", tag: "競賽得獎", pinned: true },
      { id: "a2", title: "📐 宜蘭礁溪社區微改造計畫：空間工作營志工隊召募說明會", date: "2026/10/25", tag: "在地實踐", pinned: false },
      { id: "a3", title: "🪵 參數化數位構築與木工模型工作坊：學長姐手把手榫卯實作教學", date: "2026/10/15", tag: "實作工坊", pinned: false }
    ]
  }
];

// 精靈工坊特徵（含寶箱解鎖配件）
const CHIMERA_TRAITS = {
  heads: [
    { id: "capybara", name: "水豚臉", emoji: "🦫", desc: "性格沉穩慢活，自帶呆萌氣質" },
    { id: "shiba", name: "柴犬臉", emoji: "🐕", desc: "元氣滿滿，專注力驚人" },
    { id: "cat", name: "貓咪臉", emoji: "🐱", desc: "好奇心旺盛，靈感敏銳" },
    { id: "fox", name: "赤狐臉", emoji: "🦊", desc: "機智優雅，充滿美感品味" },
    { id: "bunny", name: "白兔臉", emoji: "🐰", desc: "溫柔活潑，聽覺超靈敏" }
  ],
  specialFeatures: [
    { id: "wings", name: "小巧蜜蜂羽翼", emoji: "🪽", desc: "背部拍打輕柔羽翼，可在低空輕盈懸停" },
    { id: "antlers", name: "森林鹿角", emoji: "🦌", desc: "頭頂優雅小鹿角，能感應靈感信號" },
    { id: "cat_ears", name: "毛茸絨貓耳", emoji: "🐾", desc: "會隨心情抖動的超萌雙耳" },
    { id: "dino_spikes", name: "彩虹恐龍背刺", emoji: "🦕", desc: "俏皮的幾何小背鰭，充滿科技感" },
    { id: "sprout", name: "幸運小草苗", emoji: "🌱", desc: "頭頂冒出翠綠小嫩芽，代表學無止盡" },
    // 寶箱專屬隱藏配件（開箱後解鎖）
    { id: "scholar_hat", name: "智慧金邊學士帽", emoji: "🎓", desc: "【中央島寶箱解鎖】代表博學多聞的學者冠冕", locked: true },
    { id: "cyber_headphone", name: "Cyberpunk 發光耳機", emoji: "🎧", desc: "【資訊島寶箱解鎖】流動著霓虹代碼的光學耳機", locked: true },
    { id: "magic_palette", name: "彩釉魔法調色筆", emoji: "🪄", desc: "【產媒島寶箱解鎖】揮灑無限色彩想像的靈感神器", locked: true },
    { id: "vintage_mic", name: "復古播音金麥克風", emoji: "🎙️", desc: "【傳播島寶箱解鎖】傳遞佛光好聲音的首席麥克風", locked: true },
    { id: "lucky_pomelo", name: "水豚平衡幸運柚", emoji: "🍊", desc: "【建築島寶箱解鎖】結構力學最完美的平衡幸運果", locked: true }
  ],
  colorThemes: [
    { id: "sky_blue", name: "晴空蔚藍", hex: "#38BDF8", accent: "#BAE6FD" },
    { id: "warm_amber", name: "晨曦暖黃", hex: "#F59E0B", accent: "#FDE68A" },
    { id: "coral_pink", name: "珊瑚粉紅", hex: "#FB7185", accent: "#FECDD3" },
    { id: "mint_green", name: "抹茶森綠", hex: "#34D399", accent: "#A7F3D0" },
    { id: "lavender_purple", name: "薰衣草紫", hex: "#A855F7", accent: "#E9D5FF" }
  ]
};

// 五大島嶼金色探索寶箱配置
const TREASURES_DATA = [
  {
    id: "chest_central",
    islandId: "central",
    coords: [0, 0.7, -4.2],
    name: "中央島・知識之鑰寶箱",
    badge: "🎓 榮譽學士",
    unlockedFeature: "scholar_hat",
    desc: "解鎖精靈工坊隱藏飾品「智慧金邊學士帽」，獲得全院通識博學徽章！"
  },
  {
    id: "chest_it",
    islandId: "it",
    coords: [-17.5, 0.6, -11.5],
    name: "資訊島・量子代碼寶箱",
    badge: "💻 極客黑客",
    unlockedFeature: "cyber_headphone",
    desc: "解鎖精靈工坊隱藏飾品「Cyberpunk 發光耳機」，獲得算力代碼大師徽章！"
  },
  {
    id: "chest_design",
    islandId: "design",
    coords: [17.5, 0.6, -12],
    name: "產媒島・創客靈感寶箱",
    badge: "🎨 造物匠人",
    unlockedFeature: "magic_palette",
    desc: "解鎖精靈工坊隱藏飾品「彩釉魔法調色筆」，獲得紅點設計靈感徽章！"
  },
  {
    id: "chest_comm",
    islandId: "comm",
    coords: [-17.5, 0.6, 12],
    name: "傳播島・廣播金音寶箱",
    badge: "🎙️ 首席主播",
    unlockedFeature: "vintage_mic",
    desc: "解鎖精靈工坊隱藏飾品「復古播音金麥克風」，獲得金鐘傳播新星徽章！"
  },
  {
    id: "chest_arch",
    islandId: "arch",
    coords: [17.5, 0.6, 12],
    name: "建築島・永續之森寶箱",
    badge: "🌿 綠活建築師",
    unlockedFeature: "lucky_pomelo",
    desc: "解鎖精靈工坊隱藏飾品「水豚平衡幸運柚」，獲得空間共生大師徽章！"
  }
];

// 四系修課闖關技能樹
const SKILL_TREES_DATA = {
  it: {
    deptName: "資訊應用學系 / 人工智慧學程",
    tagline: "從 Hello World 到大型語言模型 Agent 的全端進階之路",
    color: "#38BDF8",
    years: [
      {
        year: "大一・基礎築基",
        courses: [
          { name: "計算機概論與邏輯", credits: 3, type: "必修", desc: "數位邏輯、位元運算與硬體基礎架構", stat: "算力 +15" },
          { name: "Python 程式設計實務", credits: 3, type: "必修", desc: "現代程式語法、資料爬蟲與自動化腳本", stat: "代碼力 +20" },
          { name: "多媒體技術與網頁基礎", credits: 2, type: "選修", desc: "HTML5/CSS3 與互動前導技術", stat: "創造力 +10" }
        ]
      },
      {
        year: "大二・核心架構",
        courses: [
          { name: "資料結構與演算法", credits: 3, type: "必修", desc: "樹、圖形、動態規劃與複雜度分析", stat: "邏輯力 +25" },
          { name: "物件導向程式設計 (Java/C++)", credits: 3, type: "必修", desc: "封裝繼承多型與系統架構設計", stat: "架構力 +20" },
          { name: "資料庫系統與 SQL", credits: 3, type: "選修", desc: "關聯式資料庫、索引最佳化與事務機制", stat: "數據力 +18" }
        ]
      },
      {
        year: "大三・前沿創新",
        courses: [
          { name: "人工智慧與機器學習", credits: 3, type: "必修", desc: "深度學習模型、PyTorch 實作與神經網路", stat: "AI 技能 +30" },
          { name: "LLM Agent 與智慧應用實務", credits: 3, type: "選修", desc: "Prompt 工程、RAG 向量檢索與自主代理", stat: "前沿力 +35" },
          { name: "行動應用與物聯網軟體", credits: 3, type: "選修", desc: "智慧物聯網硬體串接與跨平台 App", stat: "整合力 +22" }
        ]
      },
      {
        year: "大四・實務成果",
        courses: [
          { name: "畢業專題實作與競賽發表", credits: 4, type: "必修", desc: "全國大專資訊應用創新服務競賽參賽", stat: "實戰值 +40" },
          { name: "雲端架構與 DevOps 實務", credits: 3, type: "選修", desc: "Docker、CI/CD 與高可用性系統部署", stat: "工程力 +25" }
        ]
      }
    ]
  },
  design: {
    deptName: "產品與媒體設計學系",
    tagline: "將手繪草圖化為改變生活的微縮實體與紅點之作",
    color: "#FB7185",
    years: [
      {
        year: "大一・美感啟蒙",
        courses: [
          { name: "設計素描與基本造形", credits: 3, type: "必修", desc: "透視比例、光影素描與線條表達", stat: "美感值 +20" },
          { name: "色彩學與平面構成", credits: 2, type: "必修", desc: "色票搭配、心理色彩與視覺層次", stat: "色彩力 +18" },
          { name: "數位繪圖 (PS/AI)", credits: 3, type: "選修", desc: "向量圖形繪製與視覺風格探索", stat: "工具力 +15" }
        ]
      },
      {
        year: "大二・造形數位化",
        courses: [
          { name: "3D 數位建模 (Rhino/SolidWorks)", credits: 3, type: "必修", desc: "曲面造形建構與精確尺寸量測", stat: "3D力 +25" },
          { name: "產品設計方法學 (一)", credits: 3, type: "必修", desc: "使用者旅程研究與生活概念提案", stat: "洞察力 +22" },
          { name: "自造者工坊木工實作", credits: 2, type: "選修", desc: "實木榫卯、打磨塗裝與打樣工具運用", stat: "手作力 +20" }
        ]
      },
      {
        year: "大三・創客打樣",
        courses: [
          { name: "快速打樣與 3D 列印應用", credits: 3, type: "必修", desc: "五軸 CNC、光固化列印與翻模技術", stat: "造物力 +30" },
          { name: "視覺傳達與品牌包裝", credits: 3, type: "選修", desc: "品牌識別系統 (CIS) 與環保包裝結構", stat: "品牌力 +25" },
          { name: "文創商品開發實務", credits: 2, type: "選修", desc: "宜蘭在地文化轉譯與市集商品打樣", stat: "文創力 +20" }
        ]
      },
      {
        year: "大四・大展鋒芒",
        courses: [
          { name: "畢業設計大展 (松山文創園區)", credits: 4, type: "必修", desc: "1:1 高精樣機展演與台北松菸公開策展", stat: "策展力 +40" },
          { name: "國際設計大賽衝刺 (紅點/金點)", credits: 3, type: "選修", desc: "Red Dot、iF 概念獎參賽專案輔導", stat: "國際力 +35" }
        ]
      }
    ]
  },
  comm: {
    deptName: "傳播學系",
    tagline: "在短影音與新媒體浪潮中，用好故事打動全島與世界",
    color: "#FBBF24",
    years: [
      {
        year: "大一・敘事基礎",
        courses: [
          { name: "傳播理論與新媒體導論", credits: 3, type: "必修", desc: "媒體生態變遷、社群演算法與倫理", stat: "傳播力 +15" },
          { name: "基礎影音拍攝與剪輯", credits: 3, type: "必修", desc: "單眼相機操作、鏡頭分鏡與 Premiere", stat: "剪輯力 +20" },
          { name: "採訪寫作與故事劇本", credits: 2, type: "選修", desc: "新聞採訪、文字感染力與人物訪談", stat: "筆力 +18" }
        ]
      },
      {
        year: "大二・棚拍播音",
        courses: [
          { name: "電視棚拍與多機作業實務", credits: 3, type: "必修", desc: "4K 攝影棚導播控台、燈光與實時切換", stat: "技術力 +25" },
          { name: "Podcast 播客策劃與錄製", credits: 2, type: "選修", desc: "佛光電台 FGU Voice 節目製播與聲優技巧", stat: "聲音力 +22" },
          { name: "社群行銷與短影音敘事", credits: 3, type: "選修", desc: "Reels / TikTok 爆款腳本企劃與流量分析", stat: "爆發力 +25" }
        ]
      },
      {
        year: "大三・深度創作",
        courses: [
          { name: "劇情微電影創作", credits: 3, type: "必修", desc: "電影級調色、劇組協作與原創導演思維", stat: "導演力 +30" },
          { name: "公共關係與整合行銷傳播", credits: 3, type: "選修", desc: "品牌公關事件、危機處理與記者會籌備", stat: "公關力 +24" },
          { name: "空拍紀錄片專題", credits: 2, type: "選修", desc: "空拍無人機操作考照與在地生態紀錄", stat: "視角力 +20" }
        ]
      },
      {
        year: "大四・光芒發表",
        courses: [
          { name: "畢業影展與新媒體成果發表", credits: 4, type: "必修", desc: "影廳首映會籌辦與金穗獎等青年影展參賽", stat: "影響力 +40" },
          { name: "專業媒體機構實習", credits: 3, type: "選修", desc: "電視台、知名自媒體與公關公司現場實習", stat: "職場力 +30" }
        ]
      }
    ]
  },
  arch: {
    deptName: "建築環境設計學士學位學程",
    tagline: "以手作榫卯與綠色永續，構築能與山林共生的微縮空間",
    color: "#34D399",
    years: [
      {
        year: "大一・空間啟蒙",
        courses: [
          { name: "建築圖學與空間透視", credits: 3, type: "必修", desc: "手工製圖、軸測圖與光影投射法", stat: "透視力 +18" },
          { name: "實體模型製作與材料基礎", credits: 3, type: "必修", desc: "椴木板、風扣板與微縮幾何空間雕琢", stat: "比例力 +22" },
          { name: "環境生態與景觀概論", credits: 2, type: "選修", desc: "宜蘭在地山林、水源與微氣候分析", stat: "生態感 +15" }
        ]
      },
      {
        year: "大二・幾何參數",
        courses: [
          { name: "建築設計 (一)：空間機能與人體工學", credits: 4, type: "必修", desc: "住宅單元設計、動線組織與評圖演練", stat: "設計力 +25" },
          { name: "數位參數化建模 (Rhino/Grasshopper)", credits: 3, type: "必修", desc: "演算法生成幾何面、曲面網格與展平", stat: "參數力 +28" },
          { name: "綠建築材料與物理環境", credits: 2, type: "選修", desc: "日照採光、通風節能與生態工法評估", stat: "永續力 +20" }
        ]
      },
      {
        year: "大三・實體構築",
        courses: [
          { name: "1:1 實體木構造與榫卯構築實作", credits: 3, type: "必修", desc: "傳統榫卯結構受力分析與現場大跨距木棚架搭設", stat: "構築力 +35" },
          { name: "都市設計與礁溪社區微改造", credits: 3, type: "選修", desc: "走讀礁溪溫泉鄉、社區居民共創與景觀步道", stat: "社造力 +25" },
          { name: "景觀水苑與植栽設計", credits: 2, type: "選修", desc: "水生植物生態池、雨水回收與梯田綠化", stat: "景觀力 +22" }
        ]
      },
      {
        year: "大四・大師評圖",
        courses: [
          { name: "畢業設計評圖與大展", credits: 5, type: "必修", desc: "全國建築新人獎參賽與知名建築師評圖考核", stat: "建築力 +45" },
          { name: "建築師事務所專業實習", credits: 3, type: "選修", desc: "施工圖繪製、法規檢視與營造廠現場監造實務", stat: "專業力 +30" }
        ]
      }
    ]
  }
};

const DEFAULT_VILLAGERS = [
  {
    id: "v_1",
    name: "波波拉",
    head: "cat",
    feature: "wings",
    color: "#38BDF8",
    islandId: "it",
    position: [-14.5, 0.7, -8],
    studyGoal: "正在挑戰用 Python 訓練貓咪語音辨識模型！",
    author: "資應系大二・小翔"
  },
  {
    id: "v_2",
    name: "橘皮皮",
    head: "capybara",
    feature: "sprout",
    color: "#34D399",
    islandId: "arch",
    position: [14.8, 0.7, 12.5],
    studyGoal: "正在畫礁溪竹構涼亭的 1:50 實體微縮模型",
    author: "建築學程大三・涵涵"
  },
  {
    id: "v_3",
    name: "閃閃狐",
    head: "fox",
    feature: "cat_ears",
    color: "#FB7185",
    islandId: "design",
    position: [17, 0.7, -11],
    studyGoal: "正在為畢業展設計療癒系玩具包裝盒",
    author: "產媒系大四・阿森"
  },
  {
    id: "v_4",
    name: "多拉米",
    head: "bunny",
    feature: "wings",
    color: "#FBBF24",
    islandId: "comm",
    position: [-15, 0.7, 15.5],
    studyGoal: "正在剪輯校園 Podcast 第三集節目片頭！",
    author: "傳播系大一・亮亮"
  },
  {
    id: "v_5",
    name: "嘟嘟犬",
    head: "shiba",
    feature: "antlers",
    color: "#F59E0B",
    islandId: "central",
    position: [1.8, 0.8, 1.5],
    studyGoal: "在中央廣場自習！尋找一起參加佛光盃的隊友！",
    author: "跨域小精靈"
  }
];

const DEFAULT_STUDY_NOTES = [
  {
    id: "note_1",
    islandId: "central",
    authorName: "佛光小書僮",
    category: "自習打卡",
    badge: "📍 中央廣場自習中",
    title: "今日番茄鐘打卡 3 小時達成！",
    content: "坐在知識鐘樓下看 UI/UX 設計書，微風吹過來很舒服，大家一起加油！",
    likes: 12,
    timestamp: "10 分鐘前",
    coords: [-2, 0.7, 2]
  },
  {
    id: "note_2",
    islandId: "it",
    authorName: "阿碼不累",
    category: "找隊友",
    badge: "🤝 競賽揪團",
    title: "尋找【大專資訊應用競賽】前端好手",
    content: "我們已有後端與 AI 模型架構，想找對 3D 網頁/Three.js 或 React 感興趣的同學一起組隊參賽！",
    likes: 18,
    timestamp: "35 分鐘前",
    coords: [-17, 0.6, -7]
  },
  {
    id: "note_3",
    islandId: "design",
    authorName: "手作狂人",
    category: "學習筆記",
    badge: "💡 靈感分享",
    title: "3D 列印新手排坑指南！",
    content: "列印前底板一定要調平（校正紙大法），切片時壁厚設 1.2mm 結構最扎實～歡迎來工坊交流！",
    likes: 24,
    timestamp: "2 小時前",
    coords: [15, 0.6, -8]
  },
  {
    id: "note_4",
    islandId: "arch",
    authorName: "木構之友",
    category: "發問求助",
    badge: "❓ 課業提問",
    title: "請問大家木模型膠水推薦哪一款？",
    content: "做 1:100 的細木條桁架，白膠乾太慢、瞬間膠容易白化，大家有推薦好用的快乾木工膠嗎？",
    likes: 7,
    timestamp: "4 小時前",
    coords: [17.5, 0.6, 15]
  }
];

// 掛載全域變數
window.COLLEGE_INFO = COLLEGE_INFO;
window.ISLANDS_DATA = ISLANDS_DATA;
window.CHIMERA_TRAITS = CHIMERA_TRAITS;
window.TREASURES_DATA = TREASURES_DATA;
window.SKILL_TREES_DATA = SKILL_TREES_DATA;
window.DEFAULT_VILLAGERS = DEFAULT_VILLAGERS;
window.DEFAULT_STUDY_NOTES = DEFAULT_STUDY_NOTES;
