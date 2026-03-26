import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    fetch(`http://localhost:5000/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!ignore) {
          setProduct(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!ignore) {
          setProduct(null);
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  if (loading) {
    return <div className="mx-auto max-w-5xl px-4 py-10">Mehsul yuklenir...</div>;
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <p className="text-slate-500">Mehsul tapilmadi.</p>
      </div>
    );
  }

  const imageUrl = product.image
    ? `http://localhost:5000/uploads/${product.image}`
    : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link to="/app" className="text-sm font-medium text-red-600 hover:underline">
        Vitrine qayit
      </Link>

      <div className="mt-4 grid gap-8 rounded-3xl bg-white p-6 shadow-sm lg:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-2xl bg-slate-100">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex min-h-[320px] items-center justify-center text-slate-400">
              Sekil yoxdur
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-slate-900">{product.name}</h1>
          <p className="text-2xl font-bold text-red-600">
            {Number(product.price || 0).toLocaleString("az-AZ")} AZN
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Marka</p>
              <p className="mt-1 font-medium text-slate-900">{product.brand || "-"}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Model</p>
              <p className="mt-1 font-medium text-slate-900">{product.model || "-"}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Il</p>
              <p className="mt-1 font-medium text-slate-900">{product.year || "-"}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Magaza</p>
              <p className="mt-1 font-medium text-slate-900">{product.seller?.name || "-"}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-4">
            <p className="text-sm font-medium text-slate-500">Aciqlama</p>
            <p className="mt-2 leading-7 text-slate-700">
              {product.description || "Aciqlama yoxdur."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
