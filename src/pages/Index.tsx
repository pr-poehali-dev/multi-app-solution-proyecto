import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

type Section = "marketplace" | "scooters" | "profile" | "sellers" | "workers" | "admin" | "support";

const NAV_ITEMS: { id: Section; label: string; icon: string; color: string }[] = [
  { id: "marketplace", label: "Маркетплейс", icon: "ShoppingBag", color: "#8b5cf6" },
  { id: "scooters", label: "Самокаты", icon: "Zap", color: "#06d6a0" },
  { id: "profile", label: "Профиль", icon: "User", color: "#f72585" },
  { id: "sellers", label: "Продавцам", icon: "Store", color: "#ff6b35" },
  { id: "workers", label: "Работникам", icon: "Truck", color: "#06b6d4" },
  { id: "admin", label: "Управление", icon: "Settings2", color: "#fbbf24" },
  { id: "support", label: "Поддержка", icon: "MessageCircle", color: "#a78bfa" },
];

// ─── SHARED STATE (lifted up to simulate global) ──────────────────────────────
type CartItem = { id: number; name: string; price: number; qty: number; emoji: string };

// ─── MARKETPLACE ──────────────────────────────────────────────────────────────
function MarketplaceSection({ cartItems, setCartItems }: { cartItems: CartItem[]; setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>> }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [cartOpen, setCartOpen] = useState(false);
  const [notification, setNotification] = useState("");
  const [sort, setSort] = useState<"popular" | "cheap" | "expensive">("popular");

  const products = [
    { id: 1, name: "Электросамокат Xiaomi Pro 2", price: 42900, cat: "scooters", rating: 4.9, reviews: 312, badge: "Хит", emoji: "🛴" },
    { id: 2, name: "Шлем защитный Sport XL", price: 3200, cat: "gear", rating: 4.7, reviews: 89, badge: "Новинка", emoji: "⛑️" },
    { id: 3, name: "Замок велосипедный U-lock", price: 1890, cat: "gear", rating: 4.6, reviews: 145, badge: null, emoji: "🔒" },
    { id: 4, name: "Сумка на руль водонепроницаемая", price: 2100, cat: "bags", rating: 4.8, reviews: 67, badge: "Скидка 20%", emoji: "👜" },
    { id: 5, name: "Электросамокат Ninebot Max G2", price: 89900, cat: "scooters", rating: 4.95, reviews: 201, badge: "Премиум", emoji: "⚡" },
    { id: 6, name: "Налокотники и наколенники", price: 1450, cat: "gear", rating: 4.5, reviews: 53, badge: null, emoji: "🦾" },
    { id: 7, name: "Перчатки тактические", price: 890, cat: "gear", rating: 4.3, reviews: 34, badge: null, emoji: "🧤" },
    { id: 8, name: "Рюкзак городской 20L", price: 3800, cat: "bags", rating: 4.6, reviews: 112, badge: null, emoji: "🎒" },
  ];

  const filters = [
    { id: "all", label: "Все" },
    { id: "scooters", label: "Самокаты" },
    { id: "gear", label: "Защита" },
    { id: "bags", label: "Сумки" },
  ];

  let filtered = products.filter(
    (p) => (filter === "all" || p.cat === filter) && p.name.toLowerCase().includes(search.toLowerCase())
  );
  if (sort === "cheap") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sort === "expensive") filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sort === "popular") filtered = [...filtered].sort((a, b) => b.reviews - a.reviews);

  const totalItems = cartItems.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  const addToCart = (p: typeof products[0]) => {
    setCartItems(prev => {
      const ex = prev.find(i => i.id === p.id);
      if (ex) return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: p.id, name: p.name, price: p.price, qty: 1, emoji: p.emoji }];
    });
    setNotification(`${p.emoji} ${p.name.split(" ").slice(0, 3).join(" ")} добавлен!`);
    setTimeout(() => setNotification(""), 2500);
  };

  const changeQty = (id: number, delta: number) => {
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0));
  };

  const getBadgeStyle = (badge: string) => {
    if (badge === "Хит") return { background: "rgba(139,92,246,0.2)", color: "#8b5cf6" };
    if (badge === "Новинка") return { background: "rgba(6,214,160,0.2)", color: "#06d6a0" };
    if (badge === "Премиум") return { background: "rgba(251,191,36,0.2)", color: "#fbbf24" };
    return { background: "rgba(247,37,133,0.2)", color: "#f72585" };
  };

  return (
    <div className="space-y-6">
      {/* Notification toast */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 glass-card rounded-2xl px-5 py-3 text-white font-medium anim-up shadow-2xl"
          style={{ border: "1px solid rgba(6,214,160,0.4)", background: "rgba(6,214,160,0.1)" }}>
          ✓ {notification}
        </div>
      )}

      <div className="anim-up flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold text-white">Маркетплейс</h2>
          <p className="text-muted-foreground mt-1">Техника и аксессуары для активного города</p>
        </div>
        <button onClick={() => setCartOpen(true)}
          className="relative btn-neon rounded-2xl px-5 py-3 font-semibold flex items-center gap-2">
          <Icon name="ShoppingCart" size={20} />
          Корзина
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#f72585] text-white text-xs font-bold flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </div>

      <div className="anim-up-1 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Icon name="Search" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск товаров..."
            className="w-full bg-secondary border border-border rounded-2xl pl-11 pr-4 py-3 text-white placeholder:text-muted-foreground input-glow transition-all" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={`px-4 py-3 rounded-2xl text-sm font-medium transition-all ${filter === f.id ? "bg-[#8b5cf6] text-white" : "glass-card text-muted-foreground hover:text-white"}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div className="flex gap-2">
        <span className="text-xs text-muted-foreground self-center">Сортировка:</span>
        {([["popular", "По популярности"], ["cheap", "Сначала дешевле"], ["expensive", "Сначала дороже"]] as const).map(([val, label]) => (
          <button key={val} onClick={() => setSort(val)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${sort === val ? "bg-secondary text-white border border-[#8b5cf6]" : "text-muted-foreground hover:text-white"}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p, i) => {
          const inCart = cartItems.find(ci => ci.id === p.id);
          return (
            <div key={p.id} className={`glass-card rounded-3xl p-5 card-hover anim-up-${Math.min(i + 1, 6) as 1}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{p.emoji}</div>
                {p.badge && (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full" style={getBadgeStyle(p.badge)}>
                    {p.badge}
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-white mb-2 leading-tight">{p.name}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                <Icon name="Star" size={14} className="text-[#fbbf24]" />
                <span className="text-white font-medium">{p.rating}</span>
                <span>({p.reviews} отзывов)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-white">{p.price.toLocaleString("ru")} ₽</span>
                {inCart ? (
                  <div className="flex items-center gap-2">
                    <button onClick={() => changeQty(p.id, -1)} className="w-8 h-8 rounded-xl bg-secondary text-white font-bold hover:bg-[#8b5cf6] transition-all flex items-center justify-center">−</button>
                    <span className="text-white font-bold w-5 text-center">{inCart.qty}</span>
                    <button onClick={() => changeQty(p.id, 1)} className="w-8 h-8 rounded-xl bg-secondary text-white font-bold hover:bg-[#8b5cf6] transition-all flex items-center justify-center">+</button>
                  </div>
                ) : (
                  <button onClick={() => addToCart(p)} className="btn-neon rounded-xl px-4 py-2 text-sm font-semibold flex items-center gap-2">
                    <Icon name="Plus" size={16} />
                    В корзину
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart Modal */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)" }}
          onClick={(e) => e.target === e.currentTarget && setCartOpen(false)}>
          <div className="w-full max-w-md glass-card rounded-3xl p-6 space-y-4 anim-up" style={{ border: "1px solid var(--glass-border)" }}>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-white">Корзина ({totalItems})</h3>
              <button onClick={() => setCartOpen(false)} className="text-muted-foreground hover:text-white transition-colors">
                <Icon name="X" size={20} />
              </button>
            </div>
            {cartItems.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Корзина пуста</p>
            ) : (
              <>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between bg-secondary rounded-2xl p-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.emoji}</span>
                        <div>
                          <p className="text-sm font-medium text-white leading-tight">{item.name.split(" ").slice(0, 4).join(" ")}</p>
                          <p className="text-xs text-muted-foreground">{item.price.toLocaleString("ru")} ₽</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => changeQty(item.id, -1)} className="w-7 h-7 rounded-lg bg-background text-white text-sm font-bold hover:bg-[#f72585] transition-all flex items-center justify-center">−</button>
                        <span className="text-white font-bold w-5 text-center">{item.qty}</span>
                        <button onClick={() => changeQty(item.id, 1)} className="w-7 h-7 rounded-lg bg-background text-white text-sm font-bold hover:bg-[#8b5cf6] transition-all flex items-center justify-center">+</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Итого</p>
                    <p className="text-2xl font-display font-bold text-white">{totalPrice.toLocaleString("ru")} ₽</p>
                  </div>
                  <button onClick={() => { setCartItems([]); setCartOpen(false); setNotification("Заказ оформлен! 🎉"); setTimeout(() => setNotification(""), 3000); }}
                    className="btn-neon rounded-2xl px-6 py-3 font-bold">
                    Оформить заказ
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SCOOTERS ─────────────────────────────────────────────────────────────────
function ScootersSection() {
  const [selected, setSelected] = useState<number | null>(null);
  const [step, setStep] = useState<"map" | "order" | "confirm">("map");
  const [timer, setTimer] = useState(0);
  const [payMethod, setPayMethod] = useState<"card" | "sbp">("card");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scooters = [
    { id: 1, name: "S-042", battery: 87, dist: "0.3 км", tariff: "4 ₽/мин", status: "free" },
    { id: 2, name: "S-107", battery: 62, dist: "0.7 км", tariff: "4 ₽/мин", status: "free" },
    { id: 3, name: "S-213", battery: 34, dist: "1.1 км", tariff: "3 ₽/мин", status: "free" },
    { id: 4, name: "S-089", battery: 95, dist: "1.5 км", tariff: "5 ₽/мин", status: "busy" },
  ];
  const selectedScooter = scooters.find(s => s.id === selected);
  const pricePerMin = selectedScooter ? parseInt(selectedScooter.tariff) : 4;
  const cost = Math.floor(timer / 60) * pricePerMin + Math.floor((timer % 60) / 10);

  useEffect(() => {
    if (step === "confirm") {
      intervalRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [step]);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="space-y-6">
      <div className="anim-up">
        <h2 className="font-display text-3xl font-bold text-white">Электросамокаты</h2>
        <p className="text-muted-foreground mt-1">Аренда рядом с вами — быстро и удобно</p>
      </div>

      {step === "map" && (
        <>
          <div className="anim-up-1 relative rounded-3xl overflow-hidden" style={{ height: 280 }}>
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0d1b2a 0%, #1a2744 50%, #0d2137 100%)" }} />
            <svg className="absolute inset-0 w-full h-full opacity-20">
              {[...Array(8)].map((_, i) => <line key={`h${i}`} x1="0" y1={`${(i + 1) * 12.5}%`} x2="100%" y2={`${(i + 1) * 12.5}%`} stroke="#06d6a0" strokeWidth="0.5" />)}
              {[...Array(12)].map((_, i) => <line key={`v${i}`} x1={`${(i + 1) * 8.3}%`} y1="0" x2={`${(i + 1) * 8.3}%`} y2="100%" stroke="#06d6a0" strokeWidth="0.5" />)}
            </svg>
            {[{ x: "30%", y: "40%", id: 1 }, { x: "55%", y: "55%", id: 2 }, { x: "70%", y: "30%", id: 3 }].map((m) => (
              <button key={m.id} onClick={() => setSelected(m.id)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center float transition-all ${selected === m.id ? "scale-125" : ""}`}
                style={{ left: m.x, top: m.y, background: selected === m.id ? "rgba(139,92,246,0.4)" : "rgba(6,214,160,0.2)", border: `2px solid ${selected === m.id ? "#8b5cf6" : "#06d6a0"}` }}>
                <span className="text-lg">🛴</span>
              </button>
            ))}
            <div className="absolute transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center opacity-40"
              style={{ left: "80%", top: "65%", background: "rgba(255,100,100,0.2)", border: "2px solid #ff6464" }}>
              <span className="text-lg">🛴</span>
            </div>
            <div className="absolute bottom-4 left-4 glass-card rounded-2xl px-4 py-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#06d6a0] pulse-dot inline-block" />
              <span className="text-sm text-white font-medium">3 самоката рядом</span>
            </div>
            {selected && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 glass-card rounded-2xl px-4 py-2 text-xs text-white font-medium"
                style={{ border: "1px solid rgba(139,92,246,0.5)" }}>
                Выбран: {selectedScooter?.name} · {selectedScooter?.tariff}
              </div>
            )}
          </div>

          <div className="anim-up-2 space-y-3">
            <h3 className="text-white font-semibold">Доступные самокаты</h3>
            {scooters.map((s) => (
              <div key={s.id}
                className={`glass-card rounded-2xl p-4 transition-all ${s.status === "free" ? "card-hover cursor-pointer" : "opacity-40 cursor-not-allowed"} ${selected === s.id ? "nav-item-active" : ""}`}
                onClick={() => s.status === "free" && setSelected(s.id)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-2xl">🛴</div>
                    <div>
                      <p className="font-semibold text-white">{s.name}</p>
                      <p className="text-sm text-muted-foreground">{s.dist} от вас · {s.status === "busy" ? "Занят" : "Свободен"}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#06d6a0]">{s.tariff}</p>
                    <div className="flex items-center gap-1 mt-1 justify-end">
                      <Icon name="Battery" size={14} style={{ color: s.battery > 50 ? "#06d6a0" : s.battery > 20 ? "#fbbf24" : "#ff6464" }} />
                      <span className="text-xs text-muted-foreground">{s.battery}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selected && (
            <button onClick={() => setStep("order")} className="anim-up w-full btn-neon rounded-2xl py-4 font-bold text-lg">
              Арендовать {selectedScooter?.name} — {selectedScooter?.tariff} →
            </button>
          )}
        </>
      )}

      {step === "order" && (
        <div className="anim-up space-y-5">
          <div className="glass-card rounded-3xl p-6 space-y-5">
            <h3 className="font-display text-xl font-bold text-white">Оформление аренды</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Самокат", value: selectedScooter?.name || "" },
                { label: "Тариф", value: selectedScooter?.tariff || "" },
                { label: "Страховка", value: "Включена" },
                { label: "Старт", value: "0 ₽" },
              ].map(item => (
                <div key={item.label} className="bg-secondary rounded-2xl p-4">
                  <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                  <p className="font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Способ оплаты</p>
              <div className="flex gap-2">
                {([["card", "💳 Visa •••• 4242"], ["sbp", "⚡ СБП"]] as const).map(([val, label]) => (
                  <button key={val} onClick={() => setPayMethod(val)}
                    className={`flex-1 rounded-2xl p-3 text-sm font-medium transition-all border ${payMethod === val ? "border-[#8b5cf6] bg-[rgba(139,92,246,0.1)] text-white" : "border-border text-muted-foreground hover:text-white"}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep("map")} className="flex-1 glass-card border border-border rounded-2xl py-3 font-semibold text-white hover:bg-secondary transition-all">
                Назад
              </button>
              <button onClick={() => { setStep("confirm"); setTimer(0); }} className="flex-1 btn-neon rounded-2xl px-8 py-3 font-bold">
                Начать аренду
              </button>
            </div>
          </div>
        </div>
      )}

      {step === "confirm" && (
        <div className="anim-up text-center space-y-6 py-4">
          <div className="w-24 h-24 rounded-full mx-auto flex items-center justify-center text-5xl float"
            style={{ background: "linear-gradient(135deg, rgba(6,214,160,0.2), rgba(139,92,246,0.2))", border: "2px solid #06d6a0" }}>
            🛴
          </div>
          <div>
            <h3 className="font-display text-2xl font-bold text-white mb-2">Аренда активна!</h3>
            <p className="text-muted-foreground">Самокат {selectedScooter?.name} разблокирован</p>
          </div>
          <div className="glass-card rounded-3xl p-6 max-w-xs mx-auto space-y-3">
            <p className="text-5xl font-display font-bold grad-text">{fmt(timer)}</p>
            <p className="text-sm text-muted-foreground">Время аренды</p>
            <div className="border-t border-border pt-3">
              <p className="text-2xl font-bold text-white">{cost} ₽</p>
              <p className="text-xs text-muted-foreground">Стоимость поездки</p>
            </div>
          </div>
          <button onClick={() => { setStep("map"); setSelected(null); setTimer(0); }}
            className="btn-neon rounded-2xl px-10 py-3 font-bold"
            style={{ background: "linear-gradient(135deg, #f72585, #8b5cf6)" }}>
            Завершить аренду · {cost} ₽
          </button>
        </div>
      )}
    </div>
  );
}

// ─── PROFILE ──────────────────────────────────────────────────────────────────
function ProfileSection() {
  const [tab, setTab] = useState<"orders" | "payments" | "settings">("orders");
  const [notifs, setNotifs] = useState(true);
  const [balance, setBalance] = useState(2480);
  const [topupOpen, setTopupOpen] = useState(false);
  const [topupAmt, setTopupAmt] = useState("500");

  const orders = [
    { id: "ORD-4821", date: "28 апр", item: "Xiaomi Pro 2", amount: 42900, status: "delivered" },
    { id: "ORD-4756", date: "21 апр", item: "Аренда S-042 (23 мин)", amount: 92, status: "completed" },
    { id: "ORD-4690", date: "15 апр", item: "Шлем Sport XL", amount: 3200, status: "delivered" },
    { id: "ORD-4611", date: "09 апр", item: "Аренда S-107 (45 мин)", amount: 180, status: "completed" },
  ];

  return (
    <div className="space-y-6">
      <div className="anim-up">
        <h2 className="font-display text-3xl font-bold text-white">Личный кабинет</h2>
      </div>

      <div className="anim-up-1 glass-card rounded-3xl p-6 flex items-center gap-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-3xl font-bold text-white" style={{ background: "var(--grad-2)" }}>АИ</div>
          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#06d6a0] border-2 border-background pulse-dot" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white">Алексей Иванов</h3>
          <p className="text-muted-foreground text-sm">aleksey@example.com</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="status-active text-xs px-3 py-1 rounded-full font-medium">Верифицирован</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-display font-bold grad-text">{balance.toLocaleString("ru")} ₽</p>
          <p className="text-xs text-muted-foreground">на балансе</p>
          <button onClick={() => setTopupOpen(true)} className="mt-2 text-xs px-3 py-1 rounded-lg btn-neon font-medium">
            Пополнить
          </button>
        </div>
      </div>

      <div className="anim-up-2 grid grid-cols-3 gap-3">
        {[
          { label: "Заказов", value: "24", icon: "Package", color: "#8b5cf6" },
          { label: "Аренд", value: "12", icon: "Zap", color: "#06d6a0" },
          { label: "Потрачено", value: "94K ₽", icon: "CreditCard", color: "#f72585" },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-2xl p-4 text-center">
            <Icon name={s.icon} size={20} style={{ color: s.color }} className="mx-auto mb-2" />
            <p className="text-2xl font-display font-bold text-white">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="anim-up-3">
        <div className="flex gap-2 mb-4">
          {(["orders", "payments", "settings"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${tab === t ? "bg-[#8b5cf6] text-white" : "glass-card text-muted-foreground hover:text-white"}`}>
              {t === "orders" ? "История" : t === "payments" ? "Платежи" : "Настройки"}
            </button>
          ))}
        </div>

        {tab === "orders" && (
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="glass-card rounded-2xl p-4 flex items-center justify-between card-hover">
                <div>
                  <p className="font-medium text-white">{o.item}</p>
                  <p className="text-sm text-muted-foreground">{o.id} · {o.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">{o.amount.toLocaleString("ru")} ₽</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${o.status === "delivered" ? "status-active" : "status-inactive"}`}>
                    {o.status === "delivered" ? "Доставлен" : "Завершён"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "payments" && (
          <div className="space-y-3">
            <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-2xl">💳</div>
              <div className="flex-1">
                <p className="font-semibold text-white">Visa •••• 4242</p>
                <p className="text-sm text-muted-foreground">Основная карта · до 12/2026</p>
              </div>
              <span className="status-active text-xs px-3 py-1 rounded-full">Активна</span>
            </div>
            <button className="w-full glass-card rounded-2xl p-4 border-dashed border-2 border-border text-muted-foreground hover:text-white hover:border-[#8b5cf6] transition-all flex items-center justify-center gap-2"
              onClick={() => alert("Открывается форма добавления карты")}>
              <Icon name="Plus" size={18} />
              Добавить карту
            </button>
          </div>
        )}

        {tab === "settings" && (
          <div className="glass-card rounded-3xl p-5 space-y-1">
            <div className="flex items-center gap-4 py-3 border-b border-border">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <Icon name="Bell" size={18} className="text-[#8b5cf6]" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">Уведомления</p>
                <p className="text-xs text-muted-foreground">Push и email</p>
              </div>
              <button onClick={() => setNotifs(v => !v)}
                className={`w-12 h-6 rounded-full transition-all relative ${notifs ? "bg-[#06d6a0]" : "bg-secondary"}`}>
                <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${notifs ? "right-0.5" : "left-0.5"} shadow`} />
              </button>
            </div>
            {[
              { label: "Безопасность", desc: "Пароль и 2FA", icon: "Shield" },
              { label: "Язык", desc: "Русский", icon: "Globe" },
              { label: "Конфиденциальность", desc: "Данные и cookies", icon: "Lock" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-4 py-3 border-b border-border last:border-0 card-hover cursor-pointer"
                onClick={() => alert(`Открывается раздел: ${item.label}`)}>
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                  <Icon name={item.icon} size={18} className="text-[#8b5cf6]" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Topup Modal */}
      {topupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)" }}
          onClick={(e) => e.target === e.currentTarget && setTopupOpen(false)}>
          <div className="w-full max-w-sm glass-card rounded-3xl p-6 space-y-4 anim-up">
            <h3 className="font-display text-xl font-bold text-white">Пополнение баланса</h3>
            <div className="flex gap-2 flex-wrap">
              {["200", "500", "1000", "2000"].map(amt => (
                <button key={amt} onClick={() => setTopupAmt(amt)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${topupAmt === amt ? "bg-[#8b5cf6] text-white" : "glass-card text-muted-foreground hover:text-white"}`}>
                  {amt} ₽
                </button>
              ))}
            </div>
            <input value={topupAmt} onChange={e => setTopupAmt(e.target.value)} type="number"
              className="w-full bg-secondary border border-border rounded-2xl px-4 py-3 text-white text-xl font-bold text-center input-glow transition-all"
              placeholder="Сумма" />
            <div className="flex gap-3">
              <button onClick={() => setTopupOpen(false)} className="flex-1 glass-card border border-border rounded-2xl py-3 font-semibold text-white">Отмена</button>
              <button onClick={() => { setBalance(b => b + parseInt(topupAmt || "0")); setTopupOpen(false); }}
                className="flex-1 btn-neon rounded-2xl py-3 font-bold">
                Пополнить {topupAmt} ₽
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SELLERS ──────────────────────────────────────────────────────────────────
function SellersSection() {
  const [tab, setTab] = useState<"products" | "orders" | "analytics">("analytics");
  const [products, setProducts] = useState([
    { name: "Электросамокат Xiaomi Pro 2", stock: 5, price: 42900, status: "active" },
    { name: "Шлем Sport XL", stock: 12, price: 3200, status: "active" },
    { name: "Замок U-lock Pro", stock: 0, price: 1890, status: "inactive" },
  ]);
  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");

  const toggleProduct = (name: string) => {
    setProducts(prev => prev.map(p => p.name === name ? { ...p, status: p.status === "active" ? "inactive" : "active" } : p));
  };

  return (
    <div className="space-y-6">
      <div className="anim-up flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold text-white">Кабинет продавца</h2>
          <p className="text-muted-foreground mt-1">Управляйте магазином в одном окне</p>
        </div>
        <span className="status-active px-4 py-2 rounded-xl text-sm font-medium">Магазин активен</span>
      </div>

      <div className="anim-up-1 grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Выручка за месяц", value: "284 900 ₽", change: "+12%", icon: "TrendingUp", color: "#06d6a0" },
          { label: "Заказов", value: "134", change: "+8", icon: "ShoppingBag", color: "#8b5cf6" },
          { label: "Товаров", value: String(products.length), change: "", icon: "Package", color: "#ff6b35" },
          { label: "Рейтинг", value: "4.87 ★", change: "18 отзывов", icon: "Star", color: "#fbbf24" },
        ].map((k) => (
          <div key={k.label} className="glass-card rounded-2xl p-4">
            <Icon name={k.icon} size={20} style={{ color: k.color }} />
            <p className="text-2xl font-display font-bold text-white mt-2">{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
            <span className="text-xs mt-1 inline-block" style={{ color: k.color }}>{k.change}</span>
          </div>
        ))}
      </div>

      <div className="anim-up-2">
        <div className="flex gap-2 mb-4">
          {(["analytics", "products", "orders"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${tab === t ? "text-background font-semibold" : "glass-card text-muted-foreground hover:text-white"}`}
              style={tab === t ? { background: "#ff6b35" } : {}}>
              {t === "analytics" ? "Аналитика" : t === "products" ? "Товары" : "Заказы"}
            </button>
          ))}
        </div>

        {tab === "analytics" && (
          <div className="glass-card rounded-3xl p-5 space-y-4">
            <h3 className="font-semibold text-white">Продажи по дням недели</h3>
            <div className="flex items-end gap-2 h-32">
              {[40, 65, 45, 80, 72, 90, 85].map((v, i) => (
                <div key={i} className="flex-1 rounded-lg transition-all hover:opacity-100 cursor-pointer"
                  style={{ height: `${v}%`, background: "linear-gradient(180deg, #ff6b35, #f72585)", opacity: 0.6 + i * 0.05 }} />
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map(d => <span key={d}>{d}</span>)}
            </div>
          </div>
        )}

        {tab === "products" && (
          <div className="space-y-3">
            {products.map((p) => (
              <div key={p.name} className="glass-card rounded-2xl p-4 flex items-center justify-between card-hover">
                <div>
                  <p className="font-medium text-white">{p.name}</p>
                  <p className="text-sm text-muted-foreground">Остаток: {p.stock} шт.</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-white">{p.price.toLocaleString("ru")} ₽</span>
                  <button onClick={() => toggleProduct(p.name)}
                    className={`text-xs px-3 py-1 rounded-full cursor-pointer transition-all ${p.status === "active" ? "status-active hover:opacity-70" : "status-inactive hover:opacity-70"}`}>
                    {p.status === "active" ? "Активен" : "Выкл"}
                  </button>
                </div>
              </div>
            ))}
            <button onClick={() => setAddOpen(true)} className="w-full btn-neon rounded-2xl py-3 font-semibold flex items-center justify-center gap-2" style={{ background: "var(--grad-3)" }}>
              <Icon name="Plus" size={18} />
              Добавить товар
            </button>
          </div>
        )}

        {tab === "orders" && (
          <div className="space-y-3">
            {[
              { id: "ORD-821", buyer: "Иван П.", item: "Xiaomi Pro 2", status: "pending", amount: 42900 },
              { id: "ORD-820", buyer: "Мария С.", item: "Шлем XL", status: "active", amount: 3200 },
            ].map((o) => (
              <div key={o.id} className="glass-card rounded-2xl p-4 flex items-center justify-between card-hover">
                <div>
                  <p className="font-medium text-white">{o.item}</p>
                  <p className="text-sm text-muted-foreground">{o.id} · {o.buyer}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">{o.amount.toLocaleString("ru")} ₽</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${o.status === "active" ? "status-active" : "status-pending"}`}>
                    {o.status === "active" ? "В доставке" : "Новый"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)" }}
          onClick={(e) => e.target === e.currentTarget && setAddOpen(false)}>
          <div className="w-full max-w-sm glass-card rounded-3xl p-6 space-y-4 anim-up">
            <h3 className="font-display text-xl font-bold text-white">Новый товар</h3>
            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Название товара"
              className="w-full bg-secondary border border-border rounded-2xl px-4 py-3 text-white placeholder:text-muted-foreground input-glow transition-all" />
            <input value={newPrice} onChange={e => setNewPrice(e.target.value)} placeholder="Цена, ₽" type="number"
              className="w-full bg-secondary border border-border rounded-2xl px-4 py-3 text-white placeholder:text-muted-foreground input-glow transition-all" />
            <div className="flex gap-3">
              <button onClick={() => setAddOpen(false)} className="flex-1 glass-card border border-border rounded-2xl py-3 font-semibold text-white">Отмена</button>
              <button onClick={() => {
                if (newName && newPrice) {
                  setProducts(prev => [...prev, { name: newName, stock: 10, price: parseInt(newPrice), status: "active" }]);
                  setNewName(""); setNewPrice(""); setAddOpen(false);
                }
              }} className="flex-1 btn-neon rounded-2xl py-3 font-bold">
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── WORKERS ──────────────────────────────────────────────────────────────────
type ScooterData = { id: number; name: string; battery: number; x: string; y: string; status: "free" | "busy" | "locked"; rider?: string; lastSeen: string };

function WorkersSection({ scooterData, setScooterData }: { scooterData: ScooterData[]; setScooterData: React.Dispatch<React.SetStateAction<ScooterData[]>> }) {
  const [activeOrder, setActiveOrder] = useState<number | null>(null);
  const [online, setOnline] = useState(true);
  const [earnings, setEarnings] = useState(1240);
  const [selectedScooter, setSelectedScooter] = useState<ScooterData | null>(null);

  const orders = [
    { id: 1, from: "ул. Тверская, 18", to: "пр. Мира, 45", item: "Xiaomi Pro 2", weight: "12 кг", reward: 380, urgent: true },
    { id: 2, from: "Арбат, 7", to: "Кутузовский, 24", item: "Шлем + Накладки", weight: "3 кг", reward: 210, urgent: false },
    { id: 3, from: "Таганская, 12", to: "Шаболовка, 6", item: "Замок + Сумка", weight: "2 кг", reward: 190, urgent: false },
  ];

  const lockScooter = (id: number) => {
    setScooterData(prev => prev.map(s => s.id === id ? { ...s, status: s.status === "locked" ? "free" : "locked" } : s));
    if (selectedScooter?.id === id) {
      setSelectedScooter(prev => prev ? { ...prev, status: prev.status === "locked" ? "free" : "locked" } : null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="anim-up flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold text-white">Кабинет работника</h2>
          <p className="text-muted-foreground mt-1">Управление, маршруты и контроль самокатов</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-display font-bold grad-text">{earnings.toLocaleString("ru")} ₽</p>
          <p className="text-xs text-muted-foreground">заработано сегодня</p>
        </div>
      </div>

      {/* Online toggle */}
      <div className="anim-up-1 glass-card rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`w-3 h-3 rounded-full inline-block ${online ? "bg-[#06d6a0] pulse-dot" : "bg-muted-foreground"}`} />
          <div>
            <p className="font-semibold text-white">{online ? "Вы онлайн" : "Вы оффлайн"}</p>
            <p className="text-xs text-muted-foreground">{online ? "Принимаете заказы" : "Заказы не поступают"}</p>
          </div>
        </div>
        <button onClick={() => setOnline(v => !v)}
          className={`w-12 h-6 rounded-full transition-all relative ${online ? "bg-[#06d6a0]" : "bg-secondary"}`}>
          <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all shadow ${online ? "right-0.5" : "left-0.5"}`} />
        </button>
      </div>

      {/* Fleet Map for workers */}
      <div className="anim-up-2 glass-card rounded-3xl p-4">
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <Icon name="MapPin" size={16} className="text-[#06d6a0]" />
          Карта самокатов — GPS в реальном времени
        </h3>
        <div className="relative rounded-2xl overflow-hidden" style={{ height: 220 }}>
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0d1b2a 0%, #132030 100%)" }} />
          <svg className="absolute inset-0 w-full h-full opacity-15">
            {[...Array(6)].map((_, i) => <line key={`h${i}`} x1="0" y1={`${(i + 1) * 16.6}%`} x2="100%" y2={`${(i + 1) * 16.6}%`} stroke="#06d6a0" strokeWidth="0.5" />)}
            {[...Array(8)].map((_, i) => <line key={`v${i}`} x1={`${(i + 1) * 12.5}%`} y1="0" x2={`${(i + 1) * 12.5}%`} y2="100%" stroke="#06d6a0" strokeWidth="0.5" />)}
          </svg>
          {scooterData.map((s) => (
            <button key={s.id} onClick={() => setSelectedScooter(selectedScooter?.id === s.id ? null : s)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{
                left: s.x, top: s.y,
                background: s.status === "locked" ? "rgba(247,37,133,0.3)" : s.status === "busy" ? "rgba(255,107,53,0.3)" : "rgba(6,214,160,0.25)",
                border: `2px solid ${s.status === "locked" ? "#f72585" : s.status === "busy" ? "#ff6b35" : "#06d6a0"}`,
                boxShadow: selectedScooter?.id === s.id ? `0 0 12px ${s.status === "locked" ? "#f72585" : "#06d6a0"}` : "none",
              }}>
              <span className="text-sm">{s.status === "locked" ? "🔒" : "🛴"}</span>
            </button>
          ))}
          <div className="absolute bottom-3 left-3 flex gap-2 text-xs">
            <span className="glass-card px-2 py-1 rounded-lg" style={{ color: "#06d6a0" }}>● Свободен</span>
            <span className="glass-card px-2 py-1 rounded-lg" style={{ color: "#ff6b35" }}>● Занят</span>
            <span className="glass-card px-2 py-1 rounded-lg" style={{ color: "#f72585" }}>🔒 Заблокирован</span>
          </div>
        </div>

        {/* Selected scooter info */}
        {selectedScooter && (
          <div className="mt-3 bg-secondary rounded-2xl p-4 anim-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-white">{selectedScooter.name}</p>
                <p className="text-xs text-muted-foreground">Батарея: {selectedScooter.battery}% · {selectedScooter.lastSeen}</p>
                {selectedScooter.rider && <p className="text-xs text-[#06d6a0]">Арендатор: {selectedScooter.rider}</p>}
              </div>
              <button onClick={() => lockScooter(selectedScooter.id)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${selectedScooter.status === "locked" ? "bg-[rgba(6,214,160,0.2)] text-[#06d6a0] border border-[#06d6a0]" : "bg-[rgba(247,37,133,0.2)] text-[#f72585] border border-[#f72585]"}`}>
                {selectedScooter.status === "locked" ? "🔓 Разблокировать" : "🔒 Заблокировать"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delivery orders */}
      {online && (
        <div className="anim-up-3 space-y-3">
          <h3 className="text-white font-semibold">Доступные заказы ({orders.length})</h3>
          {orders.map((o) => (
            <div key={o.id} className={`glass-card rounded-2xl p-4 transition-all ${activeOrder === o.id ? "nav-item-active" : "card-hover"}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  {o.urgent && <span className="status-pending text-xs px-2 py-0.5 rounded-full mb-2 inline-block">⚡ Срочно</span>}
                  <p className="font-medium text-white">{o.item}</p>
                  <p className="text-xs text-muted-foreground">{o.weight}</p>
                </div>
                <p className="text-xl font-display font-bold text-[#06d6a0]">{o.reward} ₽</p>
              </div>
              <div className="space-y-1.5 mb-3">
                <div className="flex items-center gap-2">
                  <Icon name="MapPin" size={14} className="text-[#8b5cf6]" />
                  <span className="text-white text-sm">{o.from}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Navigation" size={14} className="text-[#06d6a0]" />
                  <span className="text-white text-sm">{o.to}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 glass-card rounded-xl py-2 text-sm font-medium text-muted-foreground hover:text-white transition-all border border-border">
                  Пропустить
                </button>
                <button onClick={() => { setActiveOrder(o.id); setEarnings(e => e + o.reward); }}
                  className={`flex-1 rounded-xl py-2 text-sm font-semibold transition-all ${activeOrder === o.id ? "bg-[rgba(6,214,160,0.2)] text-[#06d6a0] border border-[#06d6a0]" : "btn-neon"}`}
                  style={activeOrder === o.id ? {} : { background: "linear-gradient(135deg, #06d6a0, #06b6d4)" }}>
                  {activeOrder === o.id ? "✓ Принят" : "Принять"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── ADMIN ────────────────────────────────────────────────────────────────────
function AdminSection({ scooterData, setScooterData }: { scooterData: ScooterData[]; setScooterData: React.Dispatch<React.SetStateAction<ScooterData[]>> }) {
  const [tab, setTab] = useState<"fleet" | "users" | "tariffs" | "system">("fleet");

  const [users, setUsers] = useState([
    { id: 1, name: "Алексей Иванов", role: "Покупатель", spent: "94 200 ₽", status: "active", rides: 12 },
    { id: 2, name: "Стройматериалы ООО", role: "Продавец", spent: "284 900 ₽", status: "active", rides: 0 },
    { id: 3, name: "Сергей Курьеров", role: "Работник", spent: "34 100 ₽", status: "active", rides: 0 },
    { id: 4, name: "Андрей Тестов", role: "Покупатель", spent: "1 200 ₽", status: "active", rides: 3 },
    { id: 5, name: "Заблокированный", role: "Покупатель", spent: "0 ₽", status: "blocked", rides: 0 },
  ]);

  const [tariffs, setTariffs] = useState([
    { name: "Стандарт", price: 4, start: 0, desc: "Базовый тариф для всех", active: true },
    { name: "Премиум", price: 5, start: 0, desc: "Новые самокаты повышенного класса", active: true },
    { name: "Эконом", price: 3, start: 0, desc: "Ограниченные зоны катания", active: false },
  ]);

  const [editingTariff, setEditingTariff] = useState<string | null>(null);

  const toggleUser = (id: number) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === "active" ? "blocked" : "active" } : u));
  };

  const lockScooter = (id: number) => {
    setScooterData(prev => prev.map(s => s.id === id ? { ...s, status: s.status === "locked" ? "free" : "locked" } : s));
  };

  const toggleTariff = (name: string) => {
    setTariffs(prev => prev.map(t => t.name === name ? { ...t, active: !t.active } : t));
  };

  const activeScount = scooterData.filter(s => s.status !== "locked").length;
  const lockedCount = scooterData.filter(s => s.status === "locked").length;
  const busyCount = scooterData.filter(s => s.status === "busy").length;

  return (
    <div className="space-y-6">
      <div className="anim-up flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold text-white">Панель владельца</h2>
          <p className="text-muted-foreground mt-1">Полный контроль над платформой</p>
        </div>
        <span className="text-xs px-3 py-1.5 rounded-xl font-medium" style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.3)" }}>
          👑 Владелец
        </span>
      </div>

      {/* KPI */}
      <div className="anim-up-1 grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Пользователей", value: String(users.filter(u => u.status === "active").length), icon: "Users", color: "#8b5cf6" },
          { label: "Самокатов активно", value: String(activeScount), icon: "Zap", color: "#06d6a0" },
          { label: "В аренде сейчас", value: String(busyCount), icon: "Activity", color: "#ff6b35" },
          { label: "Заблокировано", value: String(lockedCount), icon: "Lock", color: "#f72585" },
        ].map((k) => (
          <div key={k.label} className="glass-card rounded-2xl p-4">
            <Icon name={k.icon} size={20} style={{ color: k.color }} />
            <p className="text-2xl font-display font-bold text-white mt-2">{k.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="anim-up-2">
        <div className="flex gap-2 mb-4 flex-wrap">
          {(["fleet", "users", "tariffs", "system"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${tab === t ? "text-background font-semibold" : "glass-card text-muted-foreground hover:text-white"}`}
              style={tab === t ? { background: "#fbbf24" } : {}}>
              {t === "fleet" ? "🛴 Флот" : t === "users" ? "👥 Пользователи" : t === "tariffs" ? "💰 Тарифы" : "⚙️ Система"}
            </button>
          ))}
        </div>

        {/* FLEET */}
        {tab === "fleet" && (
          <div className="space-y-4">
            {/* Map */}
            <div className="glass-card rounded-3xl p-4">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Icon name="Radio" size={16} className="text-[#06d6a0]" />
                GPS-мониторинг всего парка
                <span className="ml-auto text-xs text-[#06d6a0] font-normal">● LIVE</span>
              </h3>
              <div className="relative rounded-2xl overflow-hidden" style={{ height: 240 }}>
                <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0a1628 0%, #0f2140 100%)" }} />
                <svg className="absolute inset-0 w-full h-full opacity-20">
                  {[...Array(7)].map((_, i) => <line key={`h${i}`} x1="0" y1={`${(i + 1) * 14.28}%`} x2="100%" y2={`${(i + 1) * 14.28}%`} stroke="#8b5cf6" strokeWidth="0.5" />)}
                  {[...Array(10)].map((_, i) => <line key={`v${i}`} x1={`${(i + 1) * 10}%`} y1="0" x2={`${(i + 1) * 10}%`} y2="100%" stroke="#8b5cf6" strokeWidth="0.5" />)}
                </svg>
                {/* Пульсирующий радар */}
                <div className="absolute" style={{ left: "50%", top: "50%", transform: "translate(-50%,-50%)" }}>
                  {[1, 2, 3].map(i => (
                    <div key={i} className="absolute rounded-full" style={{
                      width: i * 60, height: i * 60,
                      top: -(i * 30), left: -(i * 30),
                      border: "1px solid rgba(139,92,246,0.15)",
                    }} />
                  ))}
                </div>
                {scooterData.map((s) => (
                  <div key={s.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                    style={{ left: s.x, top: s.y }}>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-125`}
                      style={{
                        background: s.status === "locked" ? "rgba(247,37,133,0.35)" : s.status === "busy" ? "rgba(255,107,53,0.35)" : "rgba(6,214,160,0.25)",
                        border: `2px solid ${s.status === "locked" ? "#f72585" : s.status === "busy" ? "#ff6b35" : "#06d6a0"}`,
                      }}>
                      <span className="text-sm">{s.status === "locked" ? "🔒" : "🛴"}</span>
                    </div>
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 glass-card rounded-xl px-3 py-2 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-10"
                      style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                      <p className="font-bold">{s.name}</p>
                      <p className="text-muted-foreground">🔋 {s.battery}% · {s.lastSeen}</p>
                    </div>
                  </div>
                ))}
                <div className="absolute bottom-3 right-3 text-xs text-muted-foreground glass-card px-3 py-1.5 rounded-xl">
                  {scooterData.length} самокатов на карте
                </div>
              </div>
            </div>

            {/* Scooter List with controls */}
            <div className="space-y-3">
              {scooterData.map((s) => (
                <div key={s.id} className="glass-card rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                      style={{ background: s.status === "locked" ? "rgba(247,37,133,0.1)" : "rgba(6,214,160,0.1)" }}>
                      {s.status === "locked" ? "🔒" : "🛴"}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{s.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Icon name="Battery" size={12} style={{ color: s.battery > 50 ? "#06d6a0" : s.battery > 20 ? "#fbbf24" : "#f72585" }} />
                        <span className="text-xs text-muted-foreground">{s.battery}%</span>
                        <span className="text-xs text-muted-foreground">· {s.lastSeen}</span>
                        {s.rider && <span className="text-xs text-[#ff6b35]">👤 {s.rider}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${s.status === "locked" ? "status-inactive" : s.status === "busy" ? "status-pending" : "status-active"}`}>
                      {s.status === "locked" ? "Заблокирован" : s.status === "busy" ? "В аренде" : "Свободен"}
                    </span>
                    <button onClick={() => lockScooter(s.id)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all border ${s.status === "locked" ? "border-[#06d6a0] text-[#06d6a0] hover:bg-[rgba(6,214,160,0.1)]" : "border-[#f72585] text-[#f72585] hover:bg-[rgba(247,37,133,0.1)]"}`}>
                      {s.status === "locked" ? "🔓 Разблокировать" : "🔒 Заблокировать"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* USERS */}
        {tab === "users" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">{users.filter(u => u.status === "blocked").length} заблокировано из {users.length}</p>
            </div>
            {users.map((u) => (
              <div key={u.id} className={`glass-card rounded-2xl p-4 flex items-center justify-between transition-all ${u.status === "blocked" ? "opacity-60" : ""}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold text-white"
                    style={{ background: u.status === "blocked" ? "rgba(100,100,120,0.4)" : "var(--grad-2)" }}>
                    {u.name[0]}
                  </div>
                  <div>
                    <p className="font-medium text-white">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.role} · {u.spent}</p>
                    {u.rides > 0 && <p className="text-xs text-[#8b5cf6]">{u.rides} аренд</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${u.status === "active" ? "status-active" : "status-inactive"}`}>
                    {u.status === "active" ? "Активен" : "Заблокирован"}
                  </span>
                  <button onClick={() => toggleUser(u.id)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold border transition-all ${u.status === "active" ? "border-[#f72585] text-[#f72585] hover:bg-[rgba(247,37,133,0.1)]" : "border-[#06d6a0] text-[#06d6a0] hover:bg-[rgba(6,214,160,0.1)]"}`}>
                    {u.status === "active" ? "🚫 Заблокировать" : "✓ Разблокировать"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TARIFFS */}
        {tab === "tariffs" && (
          <div className="space-y-3">
            {tariffs.map((t) => (
              <div key={t.name} className="glass-card rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-white">{t.name}</p>
                    <p className="text-sm text-muted-foreground">{t.desc}</p>
                  </div>
                  <button onClick={() => toggleTariff(t.name)}
                    className={`w-12 h-6 rounded-full transition-all relative ${t.active ? "bg-[#06d6a0]" : "bg-secondary"}`}>
                    <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all shadow ${t.active ? "right-0.5" : "left-0.5"}`} />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-secondary rounded-xl px-4 py-2 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Минута</span>
                    {editingTariff === t.name ? (
                      <input
                        type="number"
                        defaultValue={t.price}
                        className="w-16 bg-transparent text-white font-bold text-sm outline-none border-b border-[#8b5cf6]"
                        onBlur={(e) => {
                          setTariffs(prev => prev.map(tt => tt.name === t.name ? { ...tt, price: parseInt(e.target.value) || tt.price } : tt));
                          setEditingTariff(null);
                        }}
                        autoFocus
                      />
                    ) : (
                      <span className="font-bold text-white">{t.price} ₽</span>
                    )}
                  </div>
                  <button onClick={() => setEditingTariff(t.name)}
                    className="text-xs px-3 py-2 rounded-xl glass-card text-muted-foreground hover:text-white transition-all border border-border">
                    ✏️ Изменить цену
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SYSTEM */}
        {tab === "system" && (
          <div className="glass-card rounded-3xl p-5 space-y-1">
            {[
              { label: "Минимальный баланс для аренды", value: "100 ₽", icon: "Wallet" },
              { label: "Максимальная скорость (км/ч)", value: "25", icon: "Gauge" },
              { label: "Зона работы", value: "Москва и МО", icon: "Map" },
              { label: "Техподдержка", value: "9:00 — 21:00", icon: "Clock" },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <Icon name={s.icon} size={18} className="text-[#fbbf24]" />
                  <p className="text-white text-sm">{s.label}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white text-sm">{s.value}</span>
                  <button onClick={() => alert(`Редактирование: ${s.label}`)}
                    className="text-xs px-2 py-1 rounded-lg glass-card text-muted-foreground hover:text-white transition-all border border-border">
                    Изменить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SUPPORT ──────────────────────────────────────────────────────────────────
function SupportSection() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Привет! Я помогу разобраться. Выберите тему или напишите вопрос.", time: "10:00" },
    { from: "user", text: "Как пополнить баланс?", time: "10:01" },
    { from: "bot", text: "Пополнение — в разделе «Профиль → Пополнить». Принимаем Visa, МИР и СБП.", time: "10:01" },
  ]);
  const chatRef = useRef<HTMLDivElement>(null);

  const botAnswers: Record<string, string> = {
    "как начать аренду": "Откройте раздел «Самокаты», выберите самокат на карте и нажмите «Арендовать». Укажите способ оплаты — и поехали!",
    "где забрать самокат": "Самокаты отображаются на карте в разделе «Самокаты». Нажмите на ближайший маркер — там будет адрес и расстояние.",
    "как оформить возврат": "Для возврата товара напишите нам здесь с номером заказа. Мы инициируем возврат в течение 24 часов.",
    "почему не списывается оплата": "Проверьте баланс в разделе «Профиль». Минимум для аренды — 100 ₽. Пополнить можно картой или СБП.",
  };

  const faqs = [
    "Как начать аренду самоката?",
    "Где забрать самокат?",
    "Как оформить возврат?",
    "Почему не списывается оплата?",
  ];

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = (text?: string) => {
    const msg = text || message;
    if (!msg.trim()) return;
    const now = new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" });
    const botReply = botAnswers[msg.toLowerCase()] || "Спасибо за вопрос! Оператор ответит в течение 2 минут. Среднее время ответа — 1.5 мин.";
    setMessages(prev => [...prev, { from: "user", text: msg, time: now }]);
    setTimeout(() => {
      setMessages(prev => [...prev, { from: "bot", text: botReply, time: now }]);
    }, 700);
    setMessage("");
  };

  return (
    <div className="space-y-6">
      <div className="anim-up">
        <h2 className="font-display text-3xl font-bold text-white">Поддержка</h2>
        <p className="text-muted-foreground mt-1">Среднее время ответа — 2 минуты</p>
      </div>

      <div className="anim-up-1 grid grid-cols-2 gap-2">
        {faqs.map((q) => (
          <button key={q} onClick={() => sendMessage(q)}
            className="glass-card rounded-2xl p-3 text-left text-sm text-white hover:border-[#a78bfa] hover:text-[#a78bfa] border border-border transition-all card-hover">
            {q}
          </button>
        ))}
      </div>

      <div className="anim-up-2 glass-card rounded-3xl overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl" style={{ background: "var(--grad-2)" }}>🤖</div>
          <div>
            <p className="font-semibold text-white">Служба поддержки Вжух</p>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#06d6a0] pulse-dot inline-block" />
              <span className="text-xs text-[#06d6a0]">Онлайн · отвечает быстро</span>
            </div>
          </div>
        </div>

        <div ref={chatRef} className="p-4 space-y-3 max-h-72 overflow-y-auto">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-xs rounded-2xl px-4 py-3 text-sm ${m.from === "user" ? "text-white rounded-br-sm" : "glass-card text-white rounded-bl-sm border border-border"}`}
                style={m.from === "user" ? { background: "var(--grad-2)" } : {}}>
                <p>{m.text}</p>
                <p className="text-xs opacity-50 mt-1 text-right">{m.time}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-border flex gap-3">
          <input value={message} onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Напишите сообщение..."
            className="flex-1 bg-secondary border border-border rounded-2xl px-4 py-3 text-white placeholder:text-muted-foreground text-sm input-glow transition-all" />
          <button onClick={() => sendMessage()} className="btn-neon rounded-2xl px-5 py-3" style={{ background: "var(--grad-2)" }}>
            <Icon name="Send" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function Index() {
  const [section, setSection] = useState<Section>("marketplace");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [scooterData, setScooterData] = useState<ScooterData[]>([
    { id: 1, name: "S-042", battery: 87, x: "25%", y: "38%", status: "free", lastSeen: "2 мин назад" },
    { id: 2, name: "S-107", battery: 62, x: "50%", y: "55%", status: "busy", rider: "Алексей И.", lastSeen: "Сейчас" },
    { id: 3, name: "S-213", battery: 34, x: "68%", y: "28%", status: "free", lastSeen: "5 мин назад" },
    { id: 4, name: "S-089", battery: 95, x: "80%", y: "62%", status: "free", lastSeen: "1 мин назад" },
    { id: 5, name: "S-331", battery: 18, x: "35%", y: "70%", status: "locked", lastSeen: "12 мин назад" },
    { id: 6, name: "S-445", battery: 73, x: "15%", y: "60%", status: "busy", rider: "Мария С.", lastSeen: "Сейчас" },
  ]);

  const renderSection = () => {
    switch (section) {
      case "marketplace": return <MarketplaceSection cartItems={cartItems} setCartItems={setCartItems} />;
      case "scooters": return <ScootersSection />;
      case "profile": return <ProfileSection />;
      case "sellers": return <SellersSection />;
      case "workers": return <WorkersSection scooterData={scooterData} setScooterData={setScooterData} />;
      case "admin": return <AdminSection scooterData={scooterData} setScooterData={setScooterData} />;
      case "support": return <SupportSection />;
    }
  };

  const current = NAV_ITEMS.find(n => n.id === section)!;
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="blob absolute w-96 h-96 rounded-full opacity-10 -top-20 -left-20"
          style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }} />
        <div className="blob-2 absolute w-80 h-80 rounded-full opacity-10 top-1/2 -right-20"
          style={{ background: "radial-gradient(circle, #06d6a0, transparent)" }} />
        <div className="blob-3 absolute w-72 h-72 rounded-full opacity-8 bottom-20 left-1/3"
          style={{ background: "radial-gradient(circle, #f72585, transparent)" }} />
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border glass-card z-10 fixed h-full">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl spin-slow"
              style={{ background: "var(--grad-1)" }}>⚡</div>
            <div>
              <h1 className="font-display text-2xl font-bold grad-text">Вжух</h1>
              <p className="text-xs text-muted-foreground">Маркетплейс & Аренда</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button key={item.id} onClick={() => setSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all font-medium ${section === item.id ? "nav-item-active text-white" : "text-muted-foreground hover:text-white hover:bg-secondary"}`}>
              <Icon name={item.icon} size={20} style={{ color: section === item.id ? item.color : undefined }} />
              {item.label}
              {item.id === "marketplace" && cartCount > 0 && (
                <span className="ml-auto w-5 h-5 rounded-full bg-[#f72585] text-white text-xs font-bold flex items-center justify-center">{cartCount}</span>
              )}
              {section === item.id && cartCount === 0 && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: item.color }} />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-sm font-bold text-white"
              style={{ background: "var(--grad-2)" }}>АИ</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Алексей Иванов</p>
              <p className="text-xs text-muted-foreground truncate">Покупатель · Продавец</p>
            </div>
            <Icon name="LogOut" size={16} className="text-muted-foreground hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-20 glass-card border-b border-border px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base" style={{ background: "var(--grad-1)" }}>⚡</div>
          <span className="font-display text-xl font-bold grad-text">Вжух</span>
        </div>
        <div className="flex items-center gap-3">
          <Icon name={current.icon} size={18} style={{ color: current.color }} />
          <span className="text-white font-medium text-sm">{current.label}</span>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="ml-2">
            <Icon name={mobileMenuOpen ? "X" : "Menu"} size={22} className="text-white" />
          </button>
        </div>
      </div>

      {/* Mobile Overlay Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-30"
          style={{ backdropFilter: "blur(30px)", background: "rgba(10,12,20,0.97)" }}>
          <div className="p-6 pt-20 space-y-2">
            <p className="text-xs text-muted-foreground px-5 mb-4 font-medium tracking-widest uppercase">Навигация</p>
            {NAV_ITEMS.map((item) => (
              <button key={item.id} onClick={() => { setSection(item.id); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-left transition-all font-medium text-base ${section === item.id ? "nav-item-active text-white" : "text-muted-foreground hover:text-white"}`}>
                <Icon name={item.icon} size={22} style={{ color: item.color }} />
                {item.label}
                {item.id === "marketplace" && cartCount > 0 && (
                  <span className="ml-auto w-6 h-6 rounded-full bg-[#f72585] text-white text-xs font-bold flex items-center justify-center">{cartCount}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8 pt-20 lg:pt-8 pb-24 lg:pb-8 relative z-10">
          {renderSection()}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-20 glass-card border-t border-border px-2 py-2">
        <div className="flex justify-around">
          {NAV_ITEMS.slice(0, 5).map((item) => (
            <button key={item.id} onClick={() => setSection(item.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl transition-all relative ${section === item.id ? "text-white" : "text-muted-foreground"}`}>
              <Icon name={item.icon} size={20} style={{ color: section === item.id ? item.color : undefined }} />
              <span className="text-[10px] font-medium leading-none">{item.label.split(" ")[0]}</span>
              {item.id === "marketplace" && cartCount > 0 && (
                <span className="absolute -top-0.5 right-1 w-4 h-4 rounded-full bg-[#f72585] text-white text-[9px] font-bold flex items-center justify-center">{cartCount}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
