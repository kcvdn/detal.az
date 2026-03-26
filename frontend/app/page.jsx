import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";

const initialFilters = {
  brand: "",
  model: "",
  minPrice: "",
  maxPrice: "",
};

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (!ignore) {
          setProducts(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!ignore) {
          setProducts([]);
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const visibleProducts = products.filter((product) => {
    const fullText = `${product.name ?? ""} ${product.brand ?? ""} ${product.model ?? ""}`
      .toLowerCase();
    const price = Number(product.price || 0);
    const minPrice = Number(filters.minPrice || 0);
    const maxPrice = Number(filters.maxPrice || 0);

    const matchesSearch = fullText.includes(search.toLowerCase());
    const matchesBrand = (product.brand ?? "")
      .toLowerCase()
      .includes(filters.brand.toLowerCase());
    const matchesModel = (product.model ?? "")
      .toLowerCase()
      .includes(filters.model.toLowerCase());
    const matchesMin = !filters.minPrice || price >= minPrice;
    const matchesMax = !filters.maxPrice || price <= maxPrice;

    return matchesSearch && matchesBrand && matchesModel && matchesMin && matchesMax;
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-red-600 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold tracking-wide">DETAL.AZ</h1>

          <div className="hidden items-center gap-5 text-sm md:flex">
            <span>Yardim</span>
            <span>Mesajlar</span>
            <span>Secilmisler</span>
            <Link to="/login" className="font-semibold hover:underline">
              Giris
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto -mt-6 max-w-6xl px-4">
        <div className="rounded-2xl bg-white p-4 shadow-md">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <input
              className="rounded-lg border border-slate-200 p-3 outline-none transition focus:border-red-400"
              placeholder="Marka"
              value={filters.brand}
              onChange={(event) =>
                setFilters((current) => ({ ...current, brand: event.target.value }))
              }
            />
            <input
              className="rounded-lg border border-slate-200 p-3 outline-none transition focus:border-red-400"
              placeholder="Model"
              value={filters.model}
              onChange={(event) =>
                setFilters((current) => ({ ...current, model: event.target.value }))
              }
            />
            <input
              className="rounded-lg border border-slate-200 p-3 outline-none transition focus:border-red-400"
              placeholder="Qiymet min"
              type="number"
              value={filters.minPrice}
              onChange={(event) =>
                setFilters((current) => ({ ...current, minPrice: event.target.value }))
              }
            />
            <input
              className="rounded-lg border border-slate-200 p-3 outline-none transition focus:border-red-400"
              placeholder="Qiymet max"
              type="number"
              value={filters.maxPrice}
              onChange={(event) =>
                setFilters((current) => ({ ...current, maxPrice: event.target.value }))
              }
            />
          </div>

          <div className="mt-4 flex flex-col gap-3 md:flex-row">
            <input
              className="flex-1 rounded-lg border border-slate-200 p-3 outline-none transition focus:border-red-400"
              placeholder="Axtar..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <button
              type="button"
              className="rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
            >
              Elanlari goster
            </button>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">UMUMI MEHSULLAR</h2>
            <p className="text-sm text-slate-500">{visibleProducts.length} netice</p>
          </div>

          <Link
            to="/login"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-white"
          >
            Admin panel
          </Link>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-10 text-center text-slate-500 shadow-sm">
            Mehsullar yuklenir...
          </div>
        ) : visibleProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            Hazirda gosterilecek mehsul tapilmadi.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
