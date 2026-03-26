import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const imageUrl = product.image
    ? `http://localhost:5000/uploads/${product.image}`
    : null;

  return (
    <Link to={`/app/product/${product.id}`} className="group block">
      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition group-hover:-translate-y-1 group-hover:shadow-lg">
        <div className="aspect-[4/3] bg-slate-100">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              Sekil yoxdur
            </div>
          )}
        </div>

        <div className="space-y-2 p-4">
          <h3 className="text-sm font-semibold text-slate-900">{product.name}</h3>

          <p className="text-lg font-bold text-red-600">
            {Number(product.price || 0).toLocaleString("az-AZ")} AZN
          </p>

          <p className="text-xs text-slate-500">
            {[product.brand, product.model].filter(Boolean).join(" ")}
          </p>

          <p className="text-xs text-slate-400">{product.seller?.name || "Magaza yoxdur"}</p>
        </div>
      </article>
    </Link>
  );
}
