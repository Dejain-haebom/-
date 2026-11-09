import { FormEvent, useEffect, useMemo, useState } from "react";

const ASSET = "/assets";

type Game = {
  title: string;
  genre: string;
  score: string;
  description: string;
  image: string;
  steamUrl: string;
};

const heroSlides = [
  {
    title: "Little Witch in the Woods",
    genre: "Adventure / Crafting",
    score: "9.4",
    image: `${ASSET}/f0d45.png`,
    steamUrl: "https://store.steampowered.com/app/1594940/Little_Witch_in_the_Woods/",
  },
  {
    title: "Skul: The Hero Slayer",
    genre: "RPG / Roguelike",
    score: "8.2",
    image: `${ASSET}/3a1ee.png`,
    steamUrl: "https://store.steampowered.com/app/1147560/Skul_The_Hero_Slayer/",
  },
  {
    title: "Stardew Valley",
    genre: "Simulation / Healing",
    score: "9.2",
    image: `${ASSET}/095ce.png`,
    steamUrl: "https://store.steampowered.com/app/413150/Stardew_Valley/",
  },
];

const genres = [
  { name: "액션", english: "ACTION", icon: "⚔", asset: "3c591.svg", color: "#fa57a1" },
  { name: "RPG", english: "ROLE PLAY", icon: "✦", asset: "e4b8a.svg", color: "#8c61fa" },
  { name: "어드벤처", english: "EXPLORE", icon: "◎", asset: "1ad46.svg", color: "#30e0e8" },
  { name: "아케이드", english: "ARCADE", icon: "▦", asset: "f1740.svg", color: "#fab852" },
  { name: "시뮬레이션", english: "SIMULATION", icon: "⌂", asset: "1dfc6.svg", color: "#b8ed63" },
  { name: "스포츠", english: "SPORTS", icon: "◉", asset: "268a1.svg", color: "#387af2" },
];

const recommendations: Game[] = [
  {
    title: "ELDEN RING",
    genre: "RPG · 판타지 · 오픈월드",
    score: "8.8",
    description: "이 앞 고난이도 게임.",
    image: `${ASSET}/92821.png`,
    steamUrl: "https://store.steampowered.com/app/1245620/ELDEN_RING/",
  },
  {
    title: "산나비",
    genre: "액션 · 어드벤처",
    score: "9.6",
    description: "화려한 네온 도시를 누비는 자유로운 액션",
    image: `${ASSET}/83f69.png`,
    steamUrl: "https://store.steampowered.com/app/1562700/SANABI/",
  },
  {
    title: "Skul: The Hero Slayer",
    genre: "RPG · 판타지 · 로그라이크",
    score: "8.2",
    description: "다양한 전략의 로그라이크 액션",
    image: `${ASSET}/3a1ee.png`,
    steamUrl: "https://store.steampowered.com/app/1147560/Skul_The_Hero_Slayer/",
  },
  {
    title: "RED DEAD REDEMPTION Ⅱ",
    genre: "액션 · 오픈월드 · 몰입형",
    score: "9.9",
    description: "몰입형 인생 게임, 그 후속작",
    image: `${ASSET}/746b1.png`,
    steamUrl: "https://store.steampowered.com/app/1174180/Red_Dead_Redemption_2/",
  },
];

const trending = [
  {
    title: "Call of Duty®: Modern Warfare®",
    description: "지금 한국에서 가장 뜨거운 FPS 생존 어드벤처",
    score: "8.1",
    image: `${ASSET}/4339e.png`,
    steamUrl: "https://store.steampowered.com/app/2000950/Call_of_Duty_Modern_Warfare/",
  },
  {
    title: "STARDEW VALLEY",
    description: "레트로 감성으로 떠나는 새로운 힐링 모험",
    score: "9.2",
    image: `${ASSET}/095ce.png`,
    steamUrl: "https://store.steampowered.com/app/413150/Stardew_Valley/",
  },
  {
    title: "MINECRAFT",
    description: "틀에 얽매이지 않는 자유로운 크래프팅 생존",
    score: "8.0",
    image: `${ASSET}/3eb53.png`,
    steamUrl: "https://store.steampowered.com/search/?term=Minecraft",
  },
];

const platforms = [
  { name: "PC", detail: "STEAM / EPIC", mark: "P", asset: "83ba5.svg" },
  { name: "PLAYSTATION", detail: "PS5 / PS4", mark: "▣", asset: "d180d.svg" },
  { name: "XBOX", detail: "SERIES X|S", mark: "X", asset: "8cdc8.svg" },
  { name: "NINTENDO", detail: "SWITCH", mark: "N", asset: "4dbc9.svg" },
  { name: "MOBILE", detail: "IOS / ANDROID", mark: "◈", asset: "816db.svg" },
];

type ModalData = { type: "login" | "quiz"; game?: never } | { type: "game"; game: Game } | null;

function Logo() {
  return (
    <a className="logo" href="#home" aria-label="GAME PICK 홈">
      <img src={`${ASSET}/66b21.svg`} alt="" />
      <span>GAME PICK</span>
    </a>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  tone = "cyan",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  tone?: "cyan" | "pink";
}) {
  return (
    <header className="section-heading">
      <p className={`eyebrow ${tone}`}>{eyebrow}</p>
      <h2>{title}</h2>
      {description && <p className="section-description">{description}</p>}
    </header>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [slide, setSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"next" | "prev">("next");
  const [modal, setModal] = useState<ModalData>(null);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");

  // 자동 슬라이드는 사용자가 페이지를 보고 있는 동안 5초마다 이동합니다.
  useEffect(() => {
    const timer = window.setInterval(() => {
      setSlideDirection("next");
      setSlide((current) => (current + 1) % heroSlides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  // 모달이 열렸을 때 배경 스크롤을 막고 ESC 키로 닫을 수 있게 합니다.
  useEffect(() => {
    document.body.style.overflow = modal ? "hidden" : "";
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setModal(null);
    };
    window.addEventListener("keydown", closeWithEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeWithEscape);
    };
  }, [modal]);

  const searchResults = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return [];
    return [
      ...recommendations,
      ...trending.map((game) => ({ ...game, genre: "인기 게임" })),
    ].filter((game) => game.title.toLowerCase().includes(term));
  }, [search]);

  const moveSlide = (direction: number) => {
    setSlideDirection(direction > 0 ? "next" : "prev");
    setSlide((current) => (current + direction + heroSlides.length) % heroSlides.length);
  };

  const selectSlide = (index: number) => {
    if (index === slide) return;
    setSlideDirection(index > slide ? "next" : "prev");
    setSlide(index);
  };

  const chooseGenre = (name: string) => {
    setSelectedGenre(name);
    setNotice(`${name} 취향을 반영한 추천 목록으로 이동했습니다.`);
    document.querySelector("#recommendations")?.scrollIntoView({ behavior: "smooth" });
  };

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    if (!search.trim()) {
      setNotice("찾고 싶은 게임 이름을 입력해 주세요.");
      return;
    }
    setNotice(
      searchResults.length
        ? `${searchResults.length}개의 게임을 찾았습니다.`
        : `'${search}' 검색 결과가 없습니다.`,
    );
    document.querySelector("#recommendations")?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const submitNewsletter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const email = new FormData(form).get("email");
    setNotice(`${email} 주소로 구독 신청이 완료되었습니다.`);
    form.reset();
  };

  const currentHero = heroSlides[slide];

  return (
    <div className="site-shell" id="home">
      {/* 상단 내비게이션 */}
      <header className="site-header">
        <div className="header-inner">
          <Logo />
          <button
            className="menu-button"
            type="button"
            aria-label="메뉴 열기"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
          <div className={`header-panel ${menuOpen ? "is-open" : ""}`}>
            <nav aria-label="주요 메뉴">
              <a href="#home" onClick={() => setMenuOpen(false)}>
                홈
              </a>
              <a href="#genres" onClick={() => setMenuOpen(false)}>
                장르별 탐색
              </a>
              <a href="#quiz" onClick={() => setMenuOpen(false)}>
                취향 테스트
              </a>
              <a href="#trending" onClick={() => setMenuOpen(false)}>
                인기 게임
              </a>
            </nav>
            <form className="search-form" onSubmit={submitSearch}>
              <span aria-hidden="true">⌕</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="게임 이름 검색"
                aria-label="게임 이름 검색"
              />
            </form>
            <button
              className="button button-purple login-button"
              type="button"
              onClick={() => setModal({ type: "login" })}
            >
              로그인
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* 추천 게임 히어로 슬라이드 */}
        <section className="hero section-dark" aria-label="오늘의 추천 게임">
          <div className="content hero-grid">
            <div className="hero-copy">
              <p className="eyebrow cyan">YOUR NEXT GAME STARTS HERE</p>
              <h1>
                오늘은 어떤 게임에
                <br />
                빠져볼까요?
              </h1>
              <p className="hero-description">
                플레이 취향에 딱 맞는 게임을 발견해 보세요.
                <br />
                장르와 분위기, 플레이 스타일을 바탕으로 골라드려요.
              </p>
              <div className="chips">
                <span className="chip chip-cyan">오늘의 추천</span>
                <span className="chip">탐험 · 어드벤처</span>
              </div>
              <button
                className="button button-cyan"
                type="button"
                onClick={() => setModal({ type: "quiz" })}
              >
                내 취향 게임 찾기 <span>→</span>
              </button>
              <small>3분이면 충분해요</small>
            </div>

            <div className="hero-visual">
              <img className="hero-glow" src={`${ASSET}/b5358.svg`} alt="" />
              <img className="hero-orbit hero-orbit-large" src={`${ASSET}/42dd0.svg`} alt="" />
              <img className="hero-orbit hero-orbit-small" src={`${ASSET}/53280.svg`} alt="" />
              <div key={slide} className={`hero-slide-content slide-${slideDirection}`}>
                <a
                  className="hero-image-wrap"
                  href={currentHero.steamUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${currentHero.title} Steam 페이지 열기`}
                >
                  <img src={currentHero.image} alt={`${currentHero.title} 게임 아트워크`} />
                </a>
                <div className="hero-meta">
                  <div>
                    <h2>{currentHero.title}</h2>
                    <p>{currentHero.genre}</p>
                  </div>
                  <div className="editor-pick">
                    <span>이번 주 에디터 픽</span>
                    <strong>
                      {currentHero.title}　★　{currentHero.score}
                    </strong>
                  </div>
                </div>
              </div>
              <button
                className="slide-arrow prev"
                type="button"
                aria-label="이전 게임"
                onClick={() => moveSlide(-1)}
              >
                ‹
              </button>
              <button
                className="slide-arrow next"
                type="button"
                aria-label="다음 게임"
                onClick={() => moveSlide(1)}
              >
                ›
              </button>
              <div className="slide-dots" aria-label="슬라이드 선택">
                {heroSlides.map((item, index) => (
                  <button
                    key={item.title}
                    className={slide === index ? "active" : ""}
                    type="button"
                    aria-label={`${index + 1}번 슬라이드`}
                    onClick={() => selectSlide(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 장르 탐색 */}
        <section className="section section-base" id="genres">
          <div className="content">
            <SectionHeading eyebrow="FIND YOUR MOOD" title="지금 끌리는 장르는?" />
            <div className="genre-grid">
              {genres.map((genre) => (
                <button
                  className={`genre-tile ${selectedGenre === genre.name ? "selected" : ""}`}
                  type="button"
                  key={genre.name}
                  onClick={() => chooseGenre(genre.name)}
                  style={{ "--genre-color": genre.color } as React.CSSProperties}
                >
                  <span className="icon-stack">
                    <img src={`${ASSET}/${genre.asset}`} alt="" />
                    <b>{genre.icon}</b>
                  </span>
                  <span className="genre-label">
                    <strong>{genre.name}</strong>
                    <small>{genre.english}</small>
                  </span>
                  <span className="genre-arrow">↗</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 추천 카드 */}
        <section className="section recommendations section-base" id="recommendations">
          <div className="content">
            <SectionHeading
              eyebrow="PICKED FOR YOU"
              title={selectedGenre ? `${selectedGenre} 취향 저격 추천 게임` : "취향 저격 추천 게임"}
              description="가볍게 즐기기 좋은 게임부터 깊게 몰입할 작품까지"
            />
            <img className="picked-dot" src={`${ASSET}/039a6.svg`} alt="" />
            {search.trim() && (
              <p className="search-summary">
                검색 결과: <strong>{searchResults.length}개</strong>
              </p>
            )}
            <div className="card-grid">
              {(search.trim() ? searchResults : recommendations).map((game) => (
                <article className="game-card" key={game.title}>
                  <a
                    className="game-steam-link"
                    href={game.steamUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${game.title} Steam 페이지 열기`}
                  />
                  <img className="game-cover" src={game.image} alt={`${game.title} 게임 커버`} />
                  <div className="game-card-content">
                    <h3>{game.title}</h3>
                    <p className="game-genre">{game.genre}</p>
                    <strong className="score">{game.score}</strong>
                    <p className="game-description">{game.description}</p>
                    <button
                      className="detail-button"
                      type="button"
                      onClick={() => setModal({ type: "game", game })}
                    >
                      자세히 보기 →
                    </button>
                  </div>
                </article>
              ))}
              {search.trim() && searchResults.length === 0 && (
                <div className="empty-result">
                  검색 결과가 없습니다. 다른 게임 이름을 입력해 보세요.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 인기 순위 */}
        <section className="section trending section-base" id="trending">
          <div className="content">
            <SectionHeading
              eyebrow="TRENDING NOW"
              title="요즘 가장 많이 찾는 게임"
              description="플레이어들의 관심이 모이고 있는 인기작을 확인해 보세요."
              tone="pink"
            />
            <div className="ranking-list">
              {trending.map((game, index) => (
                <a
                  className="ranking-row"
                  key={game.title}
                  href={game.steamUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${game.title} Steam 페이지 열기`}
                >
                  <span className={`rank ${index === 0 ? "top" : ""}`}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <img src={game.image} alt="" />
                  <span className="ranking-copy">
                    <strong>{game.title}</strong>
                    <small>{game.description}</small>
                  </span>
                  <span className="rating">평점　{game.score}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* 취향 테스트 CTA */}
        <section className="quiz-section" id="quiz">
          <div className="content quiz-grid">
            <div>
              <p className="eyebrow cyan">3-MINUTE GAME QUIZ</p>
              <h2>
                내 취향을 분석해서
                <br />
                게임을 추천해 드릴게요.
              </h2>
              <p>
                좋아하는 분위기와 플레이 방식만 선택하면
                <br />
                지금 가장 잘 맞는 게임 리스트를 만들어 드려요.
              </p>
              <button
                className="button button-cyan"
                type="button"
                onClick={() => setModal({ type: "quiz" })}
              >
                취향 테스트 시작하기 <span>→</span>
              </button>
            </div>
            <div className="quest-art" aria-label="QUEST 취향 테스트 일러스트">
              <img className="quiz-glow" src={`${ASSET}/e535f.svg`} alt="" />
              <div className="quest-card">
                <img className="artwork-glow" src={`${ASSET}/b9c8c.svg`} alt="" />
                <img className="magic-orb" src={`${ASSET}/725e0.svg`} alt="" />
                <span className="tower tower-left" />
                <span className="tower tower-right" />
                <span className="castle-base" />
                <strong>QUEST</strong>
                <small>DISCOVER YOUR STYLE</small>
              </div>
            </div>
          </div>
        </section>

        {/* 플랫폼 선택 */}
        <section className="section platforms section-base">
          <div className="content">
            <SectionHeading eyebrow="PLAY YOUR WAY" title="어떤 기기로 플레이하나요?" />
            <div className="platform-grid">
              {platforms.map((platform) => (
                <button
                  className={`platform-tile ${selectedPlatform === platform.name ? "selected" : ""}`}
                  type="button"
                  key={platform.name}
                  onClick={() => {
                    setSelectedPlatform(platform.name);
                    setNotice(`${platform.name} 게임 추천을 선택했습니다.`);
                  }}
                >
                  <span className="icon-stack platform-icon">
                    <img src={`${ASSET}/${platform.asset}`} alt="" />
                    <b>{platform.mark}</b>
                  </span>
                  <strong>{platform.name}</strong>
                  <small>{platform.detail}</small>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 뉴스레터 구독 */}
        <section className="newsletter">
          <div className="content newsletter-grid">
            <SectionHeading
              eyebrow="LEVEL UP YOUR INBOX"
              title="새로운 게임 소식, 놓치지 마세요."
              description="신작 소식과 주간 추천 리스트를 메일로 받아보세요."
            />
            <form onSubmit={submitNewsletter}>
              <input
                type="email"
                name="email"
                required
                placeholder="이메일 주소를 입력하세요"
                aria-label="이메일 주소"
              />
              <button className="button button-purple" type="submit">
                구독하기
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* 사이트 푸터 */}
      <footer className="site-footer">
        <div className="content">
          <div className="footer-top">
            <div>
              <h2>GAME PICK</h2>
              <p>당신의 다음 플레이를 발견하는 가장 쉬운 방법.</p>
            </div>
            <nav aria-label="푸터 메뉴">
              <a href="#home">서비스 소개</a>
              <a href="#home">이용약관</a>
              <a href="#home">개인정보처리방침</a>
              <a href="mailto:hello@gamepick.example">문의하기</a>
            </nav>
          </div>
          <div className="footer-bottom">
            <p>
              © 2026 GAME PICK. ALL RIGHTS RESERVED.
              <br />본 사이트는 게임 탐색을 위한 가상의 디자인 시안입니다.
            </p>
            <div>
              <a href="https://discord.com" target="_blank" rel="noreferrer">
                DISCORD
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                INSTAGRAM
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer">
                YOUTUBE
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* 짧은 작업 결과 안내 토스트 */}
      {notice && (
        <button
          className="toast"
          type="button"
          onClick={() => setNotice("")}
          aria-label="알림 닫기"
        >
          {notice}
          <span>×</span>
        </button>
      )}

      {/* 로그인, 게임 상세, 취향 테스트에 공통으로 쓰는 팝업 */}
      {modal && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setModal(null)}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label="팝업"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              type="button"
              aria-label="팝업 닫기"
              onClick={() => setModal(null)}
            >
              ×
            </button>
            {modal.type === "login" && (
              <form
                className="modal-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  setModal(null);
                  setNotice("GAME PICK에 로그인했습니다.");
                }}
              >
                <p className="eyebrow cyan">WELCOME BACK</p>
                <h2>로그인</h2>
                <label>
                  이메일
                  <input type="email" required placeholder="game@pick.com" />
                </label>
                <label>
                  비밀번호
                  <input type="password" required minLength={4} placeholder="비밀번호 입력" />
                </label>
                <button className="button button-purple" type="submit">
                  로그인하기
                </button>
              </form>
            )}
            {modal.type === "quiz" && (
              <div className="quiz-modal">
                <p className="eyebrow cyan">QUICK TASTE CHECK</p>
                <h2>지금 가장 끌리는 플레이는?</h2>
                <div className="quiz-options">
                  {[
                    "긴장감 넘치는 전투",
                    "느긋한 탐험과 수집",
                    "깊은 이야기와 선택",
                    "친구와 함께 경쟁",
                  ].map((option) => (
                    <button
                      type="button"
                      key={option}
                      onClick={() => {
                        setModal(null);
                        setNotice(`'${option}' 취향 분석이 완료되었습니다.`);
                        document
                          .querySelector("#recommendations")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      {option}
                      <span>→</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {modal.type === "game" && (
              <div className="game-modal">
                <img src={modal.game.image} alt={`${modal.game.title} 상세 이미지`} />
                <div>
                  <p className="eyebrow cyan">GAME DETAIL</p>
                  <h2>{modal.game.title}</h2>
                  <p className="modal-genre">{modal.game.genre}</p>
                  <strong className="modal-score">★ {modal.game.score}</strong>
                  <p>{modal.game.description}</p>
                  <a
                    className="button button-cyan"
                    href={modal.game.steamUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Steam에서 보기
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
