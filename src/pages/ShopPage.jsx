import ShopView from '../components/shop/ShopView.jsx'

export default function ShopPage() {
  return (
    <section className="sys-stagger space-y-5">
      <header>
        <p className="sys-eyebrow">Обмен монет</p>
        <h1 className="mt-2">Магазин</h1>
        <p className="mt-2 max-w-prose text-moss">
          Награды стоят монет, а монеты падают только с закрытых задач. Купленное живёт 24&nbsp;часа.
        </p>
      </header>

      <div className="sys-window sys-window--gold">
        <ShopView />
      </div>
    </section>
  )
}
