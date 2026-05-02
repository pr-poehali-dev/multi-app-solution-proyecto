import { useState } from "react";
import Icon from "@/components/ui/icon";

type Section =
  | "marketplace"
  | "scooters"
  | "profile"
  | "sellers"
  | "workers"
  | "admin"
  | "support";

const NAV_ITEMS: { id: Section; label: string; icon: string; color: string }[] = [
  { id: "marketplace", label: "Маркетплейс", icon: "ShoppingBag", color: "#8b5cf6" },
  { id: "scooters", label: "Самокаты", icon: "Zap", color: "#06d6a0" },
  { id: "profile", label: "Профиль", icon: "User", color: "#f72585" },
  { id: "sellers", label: "Продавцам", icon: "Store", color: "#ff6b35" },
  { id: "workers", label: "Работникам", icon: "Truck", color: "#06b6d4" },
  { id: "admin", label: "Управление", icon: "Settings2", color: "#fbbf24" },
  { id: "support", label: "Поддержка", icon: "MessageCircle", color: "#a78bfa" },
];

// ─── MARKETPLACE ──────────────────────────────────────────────────────────────
function MarketplaceSection() {
  const [cart, setCart] = useState(0);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const products = [
    { id: 1, name: "Электросамокат Xiaomi Pro 2", price: 42900, cat: "scooters", rating: 4.9, reviews: 312, badge: "Хит", emoji: "🛴" },
    { id: 2, name: "Шлем защитный Sport XL", price: 3200, cat: "gear", rating: 4.7, reviews: 89, badge: "Новинка", emoji: "⛑️" },
    { id: 3, name: "Замок велосипедный U-lock", price: 1890, cat: "gear", rating: 4.6, reviews: 145, badge: null, emoji: "🔒" },
    { id: 4, name: "Сумка на руль водонепроницаемая", price: 2100, cat: "bags", rating: 4.8, reviews: 67, badge: "Скидка 20%", emoji: "👜" },
    { id: 5, name: "Электросамокат Ninebot Max G2", price: 89900, cat: "scooters", rating: 4.95, reviews: 201, badge: "Премиум", emoji: "⚡" },
    { id: 6, name: "Налокотники и наколенники", price: 1450, cat: "gear", rating: 4.5, reviews: 53, badge: null, emoji: "🦾" },
  ];

  const filters = [
    { id: "all", label: "Все" },
    { id: "scooters", label: "Самокаты" },
    { id: "gear", label: "Защита" },
    { id: "bags", label: "Сумки" },
  ];

  const filtered = products.filter(
    (p) =>
      (filter === "all" || p.cat === filter) &&
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  const getBadgeStyle = (badge: string) => {
    if (badge === "Хит") return { background: "rgba(139,92,246,0.2)", color: "#8b5cf6" };
    if (badge === "Новинка") return { background: "rgba(6,214,160,0.2)", color: "#06d6a0" };
    if (badge === "Премиум") return { background: "rgba(251,191,36,0.2)", color: "#fbbf24" };
    return { background: "rgba(247,37,133,0.2)", color: "#f72585" };
  };

  return (
    <div className="space-y-6">
      <div className="anim-up flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold text-white">Маркетплейс</h2>
          <p className="text-muted-foreground mt-1">Техника и аксессуары для активного города</p>
        </div>
        <button
          onClick={() => setCart((c) => Math.max(0, c + 1))}
          className="relative btn-neon rounded-2xl px-5 py-3 font-semibold flex items-center gap-2"
        >
          <Icon name="ShoppingCart" size={20} />
          Корзина
          {cart > 0 && (
            <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#f72585] text-white text-xs font-bold flex items-center justify-center">
              {cart}
            </span>
          )}
        </button>
      </div>

      <div className="anim-up-1 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Icon name="Search" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск товаров..."
            className="w-full bg-secondary border border-border rounded-2xl pl-11 pr-4 py-3 text-white placeholder:text-muted-foreground input-glow transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                filter === f.id
                  ? "bg-[#8b5cf6] text-white"
                  : "glass-card text-muted-foreground hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p, i) => (
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
              <span className="text-xl font-bold text-white">
                {p.price.toLocaleString("ru")} ₽
              </span>
              <button
                onClick={() => setCart((c) => c + 1)}
                className="btn-neon rounded-xl px-4 py-2 text-sm font-semibold flex items-center gap-2"
              >
                <Icon name="Plus" size={16} />
                В корзину
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SCOOTERS ─────────────────────────────────────────────────────────────────
function ScootersSection() {
  const [selected, setSelected] = useState<number | null>(null);
  const [step, setStep] = useState<"map" | "order" | "confirm">("map");

  const scooters = [
    { id: 1, name: "S-042", battery: 87, dist: "0.3 км", tariff: "4 ₽/мин", status: "free" },
    { id: 2, name: "S-107", battery: 62, dist: "0.7 км", tariff: "4 ₽/мин", status: "free" },
    { id: 3, name: "S-213", battery: 34, dist: "1.1 км", tariff: "3 ₽/мин", status: "free" },
    { id: 4, name: "S-089", battery: 95, dist: "1.5 км", tariff: "5 ₽/мин", status: "busy" },
  ];

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
              {[...Array(8)].map((_, i) => (
                <line key={`h${i}`} x1="0" y1={`${(i + 1) * 12.5}%`} x2="100%" y2={`${(i + 1) * 12.5}%`} stroke="#06d6a0" strokeWidth="0.5" />
              ))}
              {[...Array(12)].map((_, i) => (
                <line key={`v${i}`} x1={`${(i + 1) * 8.3}%`} y1="0" x2={`${(i + 1) * 8.3}%`} y2="100%" stroke="#06d6a0" strokeWidth="0.5" />
              ))}
            </svg>
            {[{ x: "30%", y: "40%", id: 1 }, { x: "55%", y: "55%", id: 2 }, { x: "70%", y: "30%", id: 3 }].map((m) => (
              <button key={m.id} onClick={() => setSelected(m.id)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center float"
                style={{ left: m.x, top: m.y, background: "rgba(6,214,160,0.2)", border: "2px solid #06d6a0" }}>
                <span className="text-lg">🛴</span>
              </button>
            ))}
            <div className="absolute transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center opacity-50"
              style={{ left: "80%", top: "65%", background: "rgba(255,100,100,0.2)", border: "2px solid #ff6464" }}>
              <span className="text-lg">🛴</span>
            </div>
            <div className="absolute bottom-4 left-4 glass-card rounded-2xl px-4 py-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#06d6a0] pulse-dot inline-block" />
              <span className="text-sm text-white font-medium">3 самоката рядом</span>
            </div>
            <div className="absolute top-4 right-4 glass-card rounded-2xl px-3 py-2 text-xs text-muted-foreground">
              📍 Москва, Центр
            </div>
          </div>

          <div className="anim-up-2 space-y-3">
            <h3 className="text-white font-semibold">Доступные самокаты</h3>
            {scooters.map((s) => (
              <div key={s.id}
                className={`glass-card rounded-2xl p-4 card-hover transition-all ${selected === s.id ? "nav-item-active" : ""} ${s.status === "busy" ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => s.status === "free" && setSelected(s.id)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-2xl">🛴</div>
                    <div>
                      <p className="font-semibold text-white">{s.name}</p>
                      <p className="text-sm text-muted-foreground">{s.dist} от вас</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#06d6a0]">{s.tariff}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Icon name="Battery" size={14} style={{ color: s.battery > 50 ? "#06d6a0" : s.battery > 20 ? "#fbbf24" : "#ff6464" }} />
                      <span className="text-xs text-muted-foreground">{s.battery}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selected && (
            <button onClick={() => setStep("order")}
              className="anim-up w-full btn-neon rounded-2xl py-4 font-bold text-lg">
              Арендовать самокат {scooters.find(s => s.id === selected)?.name} →
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
                { label: "Самокат", value: scooters.find(s => s.id === selected)?.name || "" },
                { label: "Тариф", value: scooters.find(s => s.id === selected)?.tariff || "" },
                { label: "Страховка", value: "Включена" },
                { label: "Старт", value: "0 ₽" },
              ].map(item => (
                <div key={item.label} className="bg-secondary rounded-2xl p-4">
                  <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                  <p className="font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="border border-border rounded-2xl p-4">
              <p className="text-sm text-muted-foreground mb-2">Способ оплаты</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">💳</div>
                <div>
                  <p className="text-white font-medium">Visa •••• 4242</p>
                  <p className="text-xs text-muted-foreground">Автосписание за аренду</p>
                </div>
                <Icon name="ChevronRight" size={16} className="ml-auto text-muted-foreground" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep("map")} className="flex-1 glass-card border border-border rounded-2xl py-3 font-semibold text-white hover:bg-secondary transition-all">
                Назад
              </button>
              <button onClick={() => setStep("confirm")} className="flex-1 btn-neon rounded-2xl px-8 py-3 font-bold">
                Начать аренду
              </button>
            </div>
          </div>
        </div>
      )}

      {step === "confirm" && (
        <div className="anim-up text-center space-y-6 py-8">
          <div className="w-24 h-24 rounded-full mx-auto flex items-center justify-center text-5xl float"
            style={{ background: "linear-gradient(135deg, rgba(6,214,160,0.2), rgba(139,92,246,0.2))", border: "2px solid #06d6a0" }}>
            🛴
          </div>
          <div>
            <h3 className="font-display text-2xl font-bold text-white mb-2">Аренда начата!</h3>
            <p className="text-muted-foreground">Самокат {scooters.find(s => s.id === selected)?.name} разблокирован</p>
            <p className="text-sm text-muted-foreground mt-1">Оплата списывается автоматически</p>
          </div>
          <div className="glass-card rounded-3xl p-4 max-w-xs mx-auto">
            <p className="text-3xl font-display font-bold grad-text">00:00</p>
            <p className="text-sm text-muted-foreground mt-1">Время аренды</p>
          </div>
          <button onClick={() => { setStep("map"); setSelected(null); }}
            className="btn-neon rounded-2xl px-10 py-3 font-bold">
            Завершить аренду
          </button>
        </div>
      )}
    </div>
  );
}

// ─── PROFILE ──────────────────────────────────────────────────────────────────
function ProfileSection() {
  const [tab, setTab] = useState<"orders" | "payments" | "settings">("orders");

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
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-3xl font-bold text-white"
            style={{ background: "var(--grad-2)" }}>АИ</div>
          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#06d6a0] border-2 border-background pulse-dot" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white">Алексей Иванов</h3>
          <p className="text-muted-foreground text-sm">aleksey@example.com</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="status-active text-xs px-3 py-1 rounded-full font-medium">Верифицирован</span>
            <span className="text-xs text-muted-foreground">С нами с 2024</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-display font-bold grad-text">2 480 ₽</p>
          <p className="text-xs text-muted-foreground">на балансе</p>
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
            <button className="w-full glass-card rounded-2xl p-4 border-dashed border-2 border-border text-muted-foreground hover:text-white hover:border-[#8b5cf6] transition-all flex items-center justify-center gap-2">
              <Icon name="Plus" size={18} />
              Добавить карту
            </button>
          </div>
        )}

        {tab === "settings" && (
          <div className="glass-card rounded-3xl p-5 space-y-1">
            {[
              { label: "Уведомления", desc: "Push и email", icon: "Bell" },
              { label: "Безопасность", desc: "Пароль и 2FA", icon: "Shield" },
              { label: "Язык", desc: "Русский", icon: "Globe" },
              { label: "Конфиденциальность", desc: "Данные и cookies", icon: "Lock" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-4 py-3 border-b border-border last:border-0 card-hover">
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
    </div>
  );
}

// ─── SELLERS ──────────────────────────────────────────────────────────────────
function SellersSection() {
  const [tab, setTab] = useState<"products" | "orders" | "analytics">("analytics");

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
          { label: "Товаров", value: "47", change: "2 новых", icon: "Package", color: "#ff6b35" },
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
            <h3 className="font-semibold text-white">Продажи по неделям</h3>
            <div className="flex items-end gap-2 h-32">
              {[40, 65, 45, 80, 72, 90, 85].map((v, i) => (
                <div key={i} className="flex-1 rounded-lg transition-all hover:opacity-80"
                  style={{ height: `${v}%`, background: "linear-gradient(180deg, #ff6b35, #f72585)", opacity: 0.7 + i * 0.04 }} />
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map(d => <span key={d}>{d}</span>)}
            </div>
          </div>
        )}

        {tab === "products" && (
          <div className="space-y-3">
            {[
              { name: "Электросамокат Xiaomi Pro 2", stock: 5, price: 42900, status: "active" },
              { name: "Шлем Sport XL", stock: 12, price: 3200, status: "active" },
              { name: "Замок U-lock Pro", stock: 0, price: 1890, status: "inactive" },
            ].map((p) => (
              <div key={p.name} className="glass-card rounded-2xl p-4 flex items-center justify-between card-hover">
                <div>
                  <p className="font-medium text-white">{p.name}</p>
                  <p className="text-sm text-muted-foreground">Остаток: {p.stock} шт.</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-white">{p.price.toLocaleString("ru")} ₽</span>
                  <span className={`text-xs px-3 py-1 rounded-full ${p.status === "active" ? "status-active" : "status-inactive"}`}>
                    {p.status === "active" ? "Активен" : "Нет в наличии"}
                  </span>
                </div>
              </div>
            ))}
            <button className="w-full btn-neon rounded-2xl py-3 font-semibold flex items-center justify-center gap-2" style={{ background: "var(--grad-3)" }}>
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
    </div>
  );
}

// ─── WORKERS ──────────────────────────────────────────────────────────────────
function WorkersSection() {
  const [activeOrder, setActiveOrder] = useState<number | null>(null);

  const orders = [
    { id: 1, from: "ул. Тверская, 18", to: "пр. Мира, 45", item: "Xiaomi Pro 2", weight: "12 кг", reward: 380, urgent: true },
    { id: 2, from: "Арбат, 7", to: "Кутузовский, 24", item: "Шлем + Накладки", weight: "3 кг", reward: 210, urgent: false },
    { id: 3, from: "Таганская, 12", to: "Шаболовка, 6", item: "Замок + Сумка", weight: "2 кг", reward: 190, urgent: false },
  ];

  return (
    <div className="space-y-6">
      <div className="anim-up flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold text-white">Кабинет курьера</h2>
          <p className="text-muted-foreground mt-1">Принимайте заказы и управляйте маршрутом</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-display font-bold grad-text">1 240 ₽</p>
          <p className="text-xs text-muted-foreground">заработано сегодня</p>
        </div>
      </div>

      <div className="anim-up-1 glass-card rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-[#06d6a0] pulse-dot inline-block" />
          <div>
            <p className="font-semibold text-white">Вы онлайн</p>
            <p className="text-xs text-muted-foreground">Принимаете заказы</p>
          </div>
        </div>
        <div className="w-12 h-6 rounded-full bg-[#06d6a0] relative cursor-pointer">
          <div className="w-5 h-5 rounded-full bg-white absolute right-0.5 top-0.5 shadow" />
        </div>
      </div>

      <div className="anim-up-2 space-y-3">
        <h3 className="text-white font-semibold">Доступные заказы ({orders.length})</h3>
        {orders.map((o) => (
          <div key={o.id}
            className={`glass-card rounded-2xl p-4 card-hover transition-all ${activeOrder === o.id ? "nav-item-active" : ""}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                {o.urgent && (
                  <span className="status-pending text-xs px-2 py-0.5 rounded-full mb-2 inline-block">⚡ Срочно</span>
                )}
                <p className="font-medium text-white">{o.item}</p>
                <p className="text-xs text-muted-foreground">{o.weight}</p>
              </div>
              <p className="text-xl font-display font-bold text-[#06d6a0]">{o.reward} ₽</p>
            </div>
            <div className="space-y-2 text-sm mb-3">
              <div className="flex items-center gap-2">
                <Icon name="MapPin" size={14} className="text-[#8b5cf6]" />
                <span className="text-white">{o.from}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Navigation" size={14} className="text-[#06d6a0]" />
                <span className="text-white">{o.to}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 glass-card rounded-xl py-2 text-sm font-medium text-muted-foreground hover:text-white transition-all border border-border">
                Пропустить
              </button>
              <button onClick={() => setActiveOrder(o.id)}
                className="flex-1 btn-neon rounded-xl py-2 text-sm font-semibold"
                style={{ background: "linear-gradient(135deg, #06d6a0, #06b6d4)" }}>
                Принять
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ADMIN ────────────────────────────────────────────────────────────────────
function AdminSection() {
  const [tab, setTab] = useState<"tariffs" | "users" | "system">("tariffs");

  return (
    <div className="space-y-6">
      <div className="anim-up flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold text-white">Администрирование</h2>
          <p className="text-muted-foreground mt-1">Управление системой и тарифами</p>
        </div>
        <span className="text-xs px-3 py-1.5 rounded-xl font-medium" style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.3)" }}>
          ⚡ Superadmin
        </span>
      </div>

      <div className="anim-up-1 grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Пользователей", value: "12 847", icon: "Users", color: "#8b5cf6" },
          { label: "Активных самокатов", value: "234", icon: "Zap", color: "#06d6a0" },
          { label: "Транзакций/день", value: "1 293", icon: "CreditCard", color: "#ff6b35" },
          { label: "Uptime системы", value: "99.9%", icon: "Activity", color: "#fbbf24" },
        ].map((k) => (
          <div key={k.label} className="glass-card rounded-2xl p-4">
            <Icon name={k.icon} size={20} style={{ color: k.color }} />
            <p className="text-2xl font-display font-bold text-white mt-2">{k.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="anim-up-2">
        <div className="flex gap-2 mb-4">
          {(["tariffs", "users", "system"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${tab === t ? "text-background font-semibold" : "glass-card text-muted-foreground hover:text-white"}`}
              style={tab === t ? { background: "#fbbf24" } : {}}>
              {t === "tariffs" ? "Тарифы" : t === "users" ? "Пользователи" : "Система"}
            </button>
          ))}
        </div>

        {tab === "tariffs" && (
          <div className="space-y-3">
            {[
              { name: "Стандарт", price: "4 ₽/мин", start: "0 ₽", desc: "Базовый тариф для всех", active: true },
              { name: "Премиум", price: "5 ₽/мин", start: "0 ₽", desc: "Новые самокаты повышенного класса", active: true },
              { name: "Эконом", price: "3 ₽/мин", start: "0 ₽", desc: "Ограниченные зоны катания", active: false },
            ].map((t) => (
              <div key={t.name} className="glass-card rounded-2xl p-4 flex items-center justify-between card-hover">
                <div>
                  <p className="font-semibold text-white">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.desc}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-white">{t.price}</p>
                    <p className="text-xs text-muted-foreground">Старт: {t.start}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full ${t.active ? "status-active" : "status-inactive"}`}>
                    {t.active ? "Вкл" : "Выкл"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "users" && (
          <div className="space-y-3">
            {[
              { name: "Алексей Иванов", role: "Покупатель", spent: "94 200 ₽", status: "active" },
              { name: "Стройматериалы ООО", role: "Продавец", spent: "284 900 ₽", status: "active" },
              { name: "Сергей Курьеров", role: "Курьер", spent: "34 100 ₽", status: "active" },
              { name: "Тест Пользователь", role: "Покупатель", spent: "0 ₽", status: "inactive" },
            ].map((u) => (
              <div key={u.name} className="glass-card rounded-2xl p-4 flex items-center justify-between card-hover">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center text-lg font-bold text-white">
                    {u.name[0]}
                  </div>
                  <div>
                    <p className="font-medium text-white">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-white">{u.spent}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${u.status === "active" ? "status-active" : "status-inactive"}`}>
                    {u.status === "active" ? "Активен" : "Заблокирован"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "system" && (
          <div className="glass-card rounded-3xl p-5">
            {[
              { label: "Минимальный баланс для аренды", value: "100 ₽", icon: "Wallet" },
              { label: "Максимальная скорость (км/ч)", value: "25", icon: "Gauge" },
              { label: "Зона работы", value: "Москва и МО", icon: "Map" },
              { label: "Техподдержка (работа)", value: "9:00 — 21:00", icon: "Clock" },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <Icon name={s.icon} size={18} className="text-[#fbbf24]" />
                  <p className="text-white">{s.label}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{s.value}</span>
                  <button className="text-xs px-2 py-1 rounded-lg glass-card text-muted-foreground hover:text-white transition-all border border-border">
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
    { from: "bot", text: "Привет! Чем могу помочь? Выберите тему или напишите вопрос.", time: "10:00" },
    { from: "user", text: "Как пополнить баланс?", time: "10:01" },
    { from: "bot", text: "Вы можете пополнить баланс в разделе «Профиль → Платежи». Принимаем карты Visa, MasterCard и СБП.", time: "10:01" },
  ]);

  const faqs = [
    "Как начать аренду самоката?",
    "Где забрать самокат?",
    "Как оформить возврат?",
    "Почему не списывается оплата?",
  ];

  const sendMessage = () => {
    if (!message.trim()) return;
    const now = new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" });
    setMessages(prev => [
      ...prev,
      { from: "user", text: message, time: now },
      { from: "bot", text: "Спасибо за вопрос! Оператор ответит в течение 2 минут.", time: now },
    ]);
    setMessage("");
  };

  return (
    <div className="space-y-6">
      <div className="anim-up">
        <h2 className="font-display text-3xl font-bold text-white">Поддержка</h2>
        <p className="text-muted-foreground mt-1">Мы всегда готовы помочь</p>
      </div>

      <div className="anim-up-1">
        <p className="text-sm font-medium text-muted-foreground mb-3">Частые вопросы</p>
        <div className="grid grid-cols-2 gap-2">
          {faqs.map((q) => (
            <button key={q} onClick={() => setMessage(q)}
              className="glass-card rounded-2xl p-3 text-left text-sm text-white hover:border-[#a78bfa] hover:text-[#a78bfa] border border-border transition-all card-hover">
              {q}
            </button>
          ))}
        </div>
      </div>

      <div className="anim-up-2 glass-card rounded-3xl overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl" style={{ background: "var(--grad-2)" }}>
            🤖
          </div>
          <div>
            <p className="font-semibold text-white">Служба поддержки</p>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#06d6a0] pulse-dot inline-block" />
              <span className="text-xs text-[#06d6a0]">Онлайн</span>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-xs rounded-2xl px-4 py-3 text-sm ${m.from === "user" ? "text-white rounded-br-sm" : "glass-card text-white rounded-bl-sm border border-border"}`}
                style={m.from === "user" ? { background: "var(--grad-2)" } : {}}>
                <p>{m.text}</p>
                <p className="text-xs opacity-60 mt-1 text-right">{m.time}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-border flex gap-3">
          <input value={message} onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Напишите сообщение..."
            className="flex-1 bg-secondary border border-border rounded-2xl px-4 py-3 text-white placeholder:text-muted-foreground text-sm input-glow transition-all" />
          <button onClick={sendMessage} className="btn-neon rounded-2xl px-5 py-3" style={{ background: "var(--grad-2)" }}>
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

  const renderSection = () => {
    switch (section) {
      case "marketplace": return <MarketplaceSection />;
      case "scooters": return <ScootersSection />;
      case "profile": return <ProfileSection />;
      case "sellers": return <SellersSection />;
      case "workers": return <WorkersSection />;
      case "admin": return <AdminSection />;
      case "support": return <SupportSection />;
    }
  };

  const current = NAV_ITEMS.find(n => n.id === section)!;

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
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
              style={{ background: "var(--grad-1)" }}>⚡</div>
            <div>
              <h1 className="font-display text-2xl font-bold grad-text">Volta</h1>
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
              {section === item.id && (
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
              <p className="text-xs text-muted-foreground truncate">aleksey@example.com</p>
            </div>
            <Icon name="LogOut" size={16} className="text-muted-foreground hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-20 glass-card border-b border-border px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
            style={{ background: "var(--grad-1)" }}>⚡</div>
          <span className="font-display text-xl font-bold grad-text">Volta</span>
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
          style={{ backdropFilter: "blur(30px)", background: "rgba(10,12,20,0.95)" }}>
          <div className="p-6 pt-20 space-y-2">
            {NAV_ITEMS.map((item) => (
              <button key={item.id} onClick={() => { setSection(item.id); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-left transition-all font-medium text-lg ${section === item.id ? "nav-item-active text-white" : "text-muted-foreground"}`}>
                <Icon name={item.icon} size={24} style={{ color: item.color }} />
                {item.label}
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
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl transition-all ${section === item.id ? "text-white" : "text-muted-foreground"}`}>
              <Icon name={item.icon} size={20} style={{ color: section === item.id ? item.color : undefined }} />
              <span className="text-[10px] font-medium leading-none">{item.label.split(" ")[0]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}