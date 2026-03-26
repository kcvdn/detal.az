import { useEffect, useRef, useState } from "react";
import Loader from "../components/Loader.jsx";
import Toast from "../components/Toast.jsx";

const emptyForm = {
  name: "",
  price: "",
  brand: "",
  model: "",
  year: "",
  condition: "new",
  origin: "original",
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [newForm, setNewForm] = useState(emptyForm);
  const [newImage, setNewImage] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editImage, setEditImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" });
  const toastTimerRef = useRef(null);
  const token = localStorage.getItem("token") ?? "";

  useEffect(() => {
    let ignore = false;

    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (!ignore) {
          setProducts(Array.isArray(data) ? data : []);
        }
      })
      .catch(() => {
        if (!ignore) {
          setProducts([]);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  const showToast = (message, type = "success") => {
    window.clearTimeout(toastTimerRef.current);
    setToast({ message, type });
    toastTimerRef.current = window.setTimeout(() => {
      setToast({ message: "", type: "success" });
    }, 3000);
  };

  const addProduct = async () => {
    setLoading(true);

    try {
      const formData = new FormData();

      Object.entries(newForm).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (newImage) {
        formData.append("image", newImage);
      }

      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          Authorization: token,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.product) {
        throw new Error("add_failed");
      }

      setProducts((current) => [data.product, ...current]);
      setNewForm(emptyForm);
      setNewImage(null);
      showToast("Mehsul elave olundu.");
    } catch {
      showToast("Mehsul elave etmek olmadi.", "error");
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (product) => {
    setEditingProduct({ ...product });
    setEditImage(null);
  };

  const updateProduct = async () => {
    if (!editingProduct) {
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      Object.entries(editingProduct).forEach(([key, value]) => {
        formData.append(key, value ?? "");
      });

      if (editImage) {
        formData.append("image", editImage);
      }

      const res = await fetch(
        `http://localhost:5000/api/products/${editingProduct.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: token,
          },
          body: formData,
        },
      );

      const data = await res.json();

      if (!res.ok || !data.product) {
        throw new Error("update_failed");
      }

      setProducts((current) =>
        current.map((product) =>
          product.id === editingProduct.id ? data.product : product,
        ),
      );

      setEditingProduct(null);
      setEditImage(null);
      showToast("Mehsul yenilendi.");
    } catch {
      showToast("Mehsul yenilenmedi.", "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Bu mehsulu silmek istediyine eminsen?")) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      });

      if (!res.ok) {
        throw new Error("delete_failed");
      }

      setProducts((current) => current.filter((product) => product.id !== id));
      showToast("Mehsul silindi.");
    } catch {
      showToast("Mehsulu silmek olmadi.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {loading && <Loader />}
      <Toast message={toast.message} type={toast.type} />

      <div>
        <h1 className="text-3xl font-bold text-slate-900">Mehsullar</h1>
        <p className="mt-1 text-sm text-slate-500">Mehsullari idare et</p>
      </div>

      <section className="grid gap-3 rounded-2xl bg-white p-6 shadow-sm md:grid-cols-2 xl:grid-cols-4">
        <input
          placeholder="Ad"
          value={newForm.name}
          onChange={(event) =>
            setNewForm((current) => ({ ...current, name: event.target.value }))
          }
          className="rounded-lg border border-slate-200 p-3"
        />
        <input
          placeholder="Qiymet"
          value={newForm.price}
          onChange={(event) =>
            setNewForm((current) => ({ ...current, price: event.target.value }))
          }
          className="rounded-lg border border-slate-200 p-3"
        />
        <input
          placeholder="Marka"
          value={newForm.brand}
          onChange={(event) =>
            setNewForm((current) => ({ ...current, brand: event.target.value }))
          }
          className="rounded-lg border border-slate-200 p-3"
        />
        <input
          placeholder="Model"
          value={newForm.model}
          onChange={(event) =>
            setNewForm((current) => ({ ...current, model: event.target.value }))
          }
          className="rounded-lg border border-slate-200 p-3"
        />
        <input
          placeholder="Il"
          value={newForm.year}
          onChange={(event) =>
            setNewForm((current) => ({ ...current, year: event.target.value }))
          }
          className="rounded-lg border border-slate-200 p-3"
        />
        <select
          value={newForm.condition}
          onChange={(event) =>
            setNewForm((current) => ({ ...current, condition: event.target.value }))
          }
          className="rounded-lg border border-slate-200 p-3"
        >
          <option value="new">Yeni</option>
          <option value="used">Islenmis</option>
        </select>
        <select
          value={newForm.origin}
          onChange={(event) =>
            setNewForm((current) => ({ ...current, origin: event.target.value }))
          }
          className="rounded-lg border border-slate-200 p-3"
        >
          <option value="original">Original</option>
          <option value="china">Cin</option>
        </select>
        <input
          type="file"
          onChange={(event) => setNewImage(event.target.files?.[0] ?? null)}
          className="rounded-lg border border-slate-200 p-3"
        />
        <button
          type="button"
          onClick={addProduct}
          className="rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Elave et
        </button>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <article
            key={product.id}
            className="rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md"
          >
            <div className="mb-3 overflow-hidden rounded-xl bg-slate-100">
              {product.image ? (
                <img
                  src={`http://localhost:5000/uploads/${product.image}`}
                  alt={product.name}
                  className="h-40 w-full object-cover"
                />
              ) : (
                <div className="flex h-40 items-center justify-center text-sm text-slate-400">
                  Sekil yoxdur
                </div>
              )}
            </div>

            <h3 className="font-bold text-slate-900">{product.name}</h3>
            <p className="mt-1 text-sm text-slate-500">
              {[product.brand, product.model].filter(Boolean).join(" ")}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {[product.year, product.condition, product.origin].filter(Boolean).join(" • ")}
            </p>
            <p className="mt-2 text-lg font-bold text-blue-600">{product.price} AZN</p>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => openEdit(product)}
                className="flex-1 rounded-lg bg-amber-500 px-3 py-2 text-white"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => deleteProduct(product.id)}
                className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-white"
              >
                Sil
              </button>
            </div>
          </article>
        ))}
      </section>

      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="grid w-full max-w-3xl gap-4 rounded-3xl bg-white p-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-3">
              <div className="overflow-hidden rounded-2xl bg-slate-100">
                {editingProduct.image ? (
                  <img
                    src={`http://localhost:5000/uploads/${editingProduct.image}`}
                    alt={editingProduct.name}
                    className="h-60 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-60 items-center justify-center text-sm text-slate-400">
                    Sekil yoxdur
                  </div>
                )}
              </div>

              <input
                type="file"
                onChange={(event) => setEditImage(event.target.files?.[0] ?? null)}
                className="w-full rounded-lg border border-slate-200 p-3"
              />
            </div>

            <div className="space-y-3">
              <input
                value={editingProduct.name || ""}
                onChange={(event) =>
                  setEditingProduct((current) => ({ ...current, name: event.target.value }))
                }
                className="w-full rounded-lg border border-slate-200 p-3"
              />
              <input
                value={editingProduct.price || ""}
                onChange={(event) =>
                  setEditingProduct((current) => ({ ...current, price: event.target.value }))
                }
                className="w-full rounded-lg border border-slate-200 p-3"
              />
              <input
                value={editingProduct.brand || ""}
                onChange={(event) =>
                  setEditingProduct((current) => ({ ...current, brand: event.target.value }))
                }
                className="w-full rounded-lg border border-slate-200 p-3"
              />
              <input
                value={editingProduct.model || ""}
                onChange={(event) =>
                  setEditingProduct((current) => ({ ...current, model: event.target.value }))
                }
                className="w-full rounded-lg border border-slate-200 p-3"
              />

              <div className="pt-4">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={updateProduct}
                    className="w-full rounded-lg bg-emerald-600 p-3 text-white"
                  >
                    Tesdiq et
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(null);
                      setEditImage(null);
                    }}
                    className="w-full rounded-lg bg-slate-400 p-3 text-white"
                  >
                    Legv et
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
