import { useState, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence } from "framer-motion";
import Notification from "./Toast";

// --- UTILS & SERVICES ---
const formatMoney = (amount) => amount.toLocaleString("vi-VN");

const printData = (title, subTitle, data, isInvoice, customerInfo = {}) => {
  const totalMoney = data.reduce(
    (sum, item) =>
      sum + (isInvoice ? item.buyQuantity : item.soLuong) * item.donGia,
    0
  );

  const dateStr = `Ngày ${new Date().getDate()} tháng ${
    new Date().getMonth() + 1
  } năm ${new Date().getFullYear()}`;

  const rowsHtml = data
    .map((item, index) => {
      const qty = isInvoice ? item.buyQuantity : item.soLuong;
      return `
      <tr>
        <td class="text-center">${index + 1}</td>
        <td>${item.tenSach}</td>
        <td>${item.tacGia}</td>
        <td class="text-center">${qty}</td>
        <td class="text-right">${formatMoney(item.donGia)}</td>
        <td class="text-right">${formatMoney(qty * item.donGia)}</td>
      </tr>`;
    })
    .join("");

  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title} - NamDZ Store</title>
        <style>
           body { font-family: "Times New Roman", Times, serif; color: #000; padding: 20px; font-size: 13pt; max-width: 800px; margin: 0 auto; }
           .header { display: flex; justify-content: space-between; border-bottom: 3px double #000; padding-bottom: 15px; margin-bottom: 20px; }
           .company { font-size: 20pt; font-weight: bold; text-transform: uppercase; }
           .title { text-align: center; margin: 30px 0; text-transform: uppercase; font-weight: bold; font-size: 26pt; }
           .sub-title { text-align: center; font-style: italic; font-size: 12pt; margin-top: -20px; margin-bottom: 30px; }
           table { width: 100%; border-collapse: collapse; margin-top: 20px; }
           th, td { border: 1px solid #000; padding: 8px 10px; }
           th { background: #f5f5f5; text-align: center; }
           .text-center { text-align: center; }
           .text-right { text-align: right; }
           .summary { margin-top: 20px; text-align: right; font-size: 14pt; }
           .signatures { margin-top: 50px; display: flex; justify-content: space-between; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <div><div class="company">NHÀ SÁCH NAM DZ</div><div>99 Tô Hiến Thành, Đà Nẵng</div></div>
          <div class="text-right"><strong>QUYỂN SỐ: 01</strong><br>Số: ${Math.floor(
            Math.random() * 10000
          )}</div>
        </div>
        <h1 class="title">${title}</h1>
        <p class="sub-title">${subTitle}<br>${dateStr}</p>
        
        ${
          isInvoice
            ? `
        <div style="margin-bottom: 20px;">
          <div><strong>Khách hàng:</strong> ${
            customerInfo.name || "................................"
          }</div>
          <div><strong>Điện thoại:</strong> ${
            customerInfo.phone || "................................"
          }</div>
          <div><strong>Địa chỉ:</strong> ${
            customerInfo.address || "................................"
          }</div>
        </div>`
            : ""
        }

        <table>
          <thead>
            <tr><th>STT</th><th>Tên hàng</th><th>Tác giả</th><th>SL</th><th>Đơn giá</th><th>Thành tiền</th></tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
        <div class="summary"><strong>Tổng tiền: ${formatMoney(
          totalMoney
        )} đ</strong></div>
        <div class="signatures">
          <div>
            <strong>NGƯỜI MUA</strong><br><i>(Ký, ghi rõ họ tên)</i><br><br><br>
            <div style="text-transform: uppercase; font-weight: bold;">${
              customerInfo.name || ""
            }</div>
          </div>
          <div>
             <strong>NGƯỜI BÁN</strong><br><i>(Ký, ghi rõ họ tên)</i><br><br><br>
             <div style="text-transform: uppercase; font-weight: bold;">NHÀ SÁCH NAM DZ</div>
          </div>
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
};

// --- CUSTOM HOOKS ---
const useInventory = (initialBooks = []) => {
  const [books, setBooks] = useState(initialBooks);

  const addBook = (data) => {
    setBooks((prev) => [
      ...prev,
      {
        id: window.crypto.randomUUID(),
        ...data,
        soLuong: +data.soLuong,
        donGia: +data.donGia,
      },
    ]);
  };

  const updateBook = (id, data) => {
    setBooks((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, ...data, soLuong: +data.soLuong, donGia: +data.donGia }
          : b
      )
    );
  };

  const deleteBook = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sách này?")) {
      setBooks((prev) => prev.filter((b) => b.id !== id));
      return true;
    }
    return false;
  };

  const reduceStock = (cartItems) => {
    setBooks((prev) =>
      prev.map((book) => {
        const item = cartItems.find((c) => c.id === book.id);
        return item
          ? { ...book, soLuong: book.soLuong - item.buyQuantity }
          : book;
      })
    );
  };

  const totalValue = useMemo(
    () => books.reduce((sum, b) => sum + b.soLuong * b.donGia, 0),
    [books]
  );

  return { books, addBook, updateBook, deleteBook, reduceStock, totalValue };
};

const useCart = (maxStockLookup) => {
  const [cart, setCart] = useState([]);

  const addToCart = (book) => {
    setCart((prev) => {
      const exist = prev.find((i) => i.id === book.id);
      if (exist) {
        if (exist.buyQuantity >= book.soLuong) return prev; // Max stock reached logic handled in UI
        return prev.map((i) =>
          i.id === book.id ? { ...i, buyQuantity: i.buyQuantity + 1 } : i
        );
      }
      return [...prev, { ...book, buyQuantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const newQty = item.buyQuantity + delta;
        return newQty > 0 && newQty <= maxStockLookup(id)
          ? { ...item, buyQuantity: newQty }
          : item;
      })
    );
  };

  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((i) => i.id !== id));
  const clearCart = () => setCart([]);

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.buyQuantity * item.donGia, 0),
    [cart]
  );

  return { cart, addToCart, updateQuantity, removeFromCart, clearCart, total };
};

// --- SUB-COMPONENTS ---
const StatsCard = ({ title, value, colorClass, icon }) => (
  <div
    className={`px-4 py-2 rounded-xl border flex flex-col justify-center ${colorClass}`}
  >
    <span className={`text-sm opacity-80`}>{title}</span>
    <div className="text-2xl font-bold">{value}</div>
  </div>
);

const BookForm = ({ onSubmit, onCancel, defaultValues = {} }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });

  // Reset form when defaultValues change (e.g. switching from add to edit)
  useMemo(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in"
    >
      {[
        { name: "tenSach", label: "Tên sách", type: "text" },
        { name: "tacGia", label: "Tác giả", type: "text" },
        { name: "soLuong", label: "Số lượng", type: "number", min: 1 },
        { name: "donGia", label: "Đơn giá", type: "number", min: 0 },
      ].map((field) => (
        <div key={field.name} className="space-y-2">
          <label className="text-gray-300 text-sm">{field.label}</label>
          <input
            type={field.type}
            {...register(field.name, {
              required: `Nhập ${field.label.toLowerCase()}`,
              min: field.min,
            })}
            className={`w-full bg-white/5 border ${
              errors[field.name] ? "border-red-500" : "border-white/10"
            } rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none`}
            placeholder={`Nhập ${field.label.toLowerCase()}...`}
          />
          {errors[field.name] && (
            <p className="text-red-400 text-xs">{errors[field.name].message}</p>
          )}
        </div>
      ))}
      <div className="md:col-span-2 flex gap-3 pt-2">
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-xl font-bold transition-all"
        >
          Lưu Lại
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-600 hover:bg-gray-500 text-white px-8 py-3 rounded-xl font-bold transition-all"
        >
          Hủy
        </button>
      </div>
    </form>
  );
};

// --- MAIN COMPONENT ---
function BookManager() {
  const [activeTab, setActiveTab] = useState("manager");
  const [toast, setToast] = useState(null);
  const [formMode, setFormMode] = useState("hidden"); // "hidden" | "add" | "edit"
  const [editingBook, setEditingBook] = useState(null);

  const { books, addBook, updateBook, deleteBook, reduceStock, totalValue } =
    useInventory([]);

  const getStock = useCallback(
    (id) => books.find((b) => b.id === id)?.soLuong || 0,
    [books]
  );
  const { cart, addToCart, updateQuantity, removeFromCart, clearCart, total } =
    useCart(getStock);
  const [customer, setCustomer] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const showToast = (type, title, msg) =>
    setToast({ type, title, message: msg });

  // Handlers
  const handleSaveBook = (data) => {
    if (formMode === "edit" && editingBook) {
      updateBook(editingBook.id, data);
      showToast("success", "Cập nhật", "Đã sửa thông tin sách!");
    } else {
      addBook(data);
      showToast("success", "Thêm mới", "Đã thêm sách vào kho!");
    }
    setFormMode("hidden");
    setEditingBook(null);
  };

  const handleCheckout = () => {
    if (cart.length === 0)
      return showToast("warning", "Trống", "Giỏ hàng đang trống!");
    printData(
      "HÓA ĐƠN BÁN HÀNG",
      "(Liên 2: Giao khách hàng)",
      cart,
      true,
      customer
    );
    reduceStock(cart);
    clearCart();
    setCustomer({ name: "", address: "", phone: "" });
    showToast("success", "Thành công", "Đã tạo hóa đơn và xuất kho!");
  };

  return (
    <div
      className="min-h-screen p-4 md:p-8 relative bg-cover bg-center bg-fixed font-sans"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2428')",
      }}
    >
      {/* Notifications */}
      <div className="fixed top-5 right-5 z-50">
        <AnimatePresence>
          {toast && (
            <Notification
              {...toast}
              onClose={() => setToast(null)}
              duration={3000}
            />
          )}
        </AnimatePresence>
      </div>
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-[2px]"></div>

      <div className="relative max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="flex justify-center mb-8 gap-4">
          {[
            {
              id: "manager",
              label: "Quản Lý Kho",
              color: "from-blue-500 to-cyan-500 shadow-blue-500/50",
            },
            {
              id: "invoice",
              label: "Tạo Hóa Đơn",
              color: "from-green-500 to-emerald-500 shadow-green-500/50",
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-8 py-3 rounded-full font-bold text-lg transition-all hover:scale-105 ${
                activeTab === tab.id
                  ? `bg-linear-to-r ${tab.color} text-white shadow-lg`
                  : "bg-white/10 text-gray-400"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* --- MANAGER TAB --- */}
        {activeTab === "manager" && (
          <div className="animate-fade-in space-y-8">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 flex flex-wrap justify-between items-center gap-4">
              <h2 className="text-3xl font-bold text-white">
                📦 Kho Sách ({books.length})
              </h2>
              <div className="flex gap-4">
                <StatsCard
                  title="Tổng đầu sách"
                  value={books.length}
                  colorClass="bg-blue-500/20 border-blue-500/30 text-blue-300 text-white"
                />
                <StatsCard
                  title="Giá trị kho"
                  value={`${formatMoney(totalValue)}đ`}
                  colorClass="bg-green-500/20 border-green-500/30 text-green-300 text-white"
                />
              </div>
              <button
                onClick={() => {
                  setFormMode("add");
                  setEditingBook(null);
                }}
                className="bg-linear-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-blue-500/30 transition-all"
              >
                + Thêm Sách
              </button>
            </div>

            {formMode !== "hidden" && (
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6">
                <h3 className="text-xl font-bold text-white mb-4">
                  {formMode === "edit"
                    ? "✏️ Cập nhật sách"
                    : "✨ Thêm sách mới"}
                </h3>
                <BookForm
                  key={formMode + (editingBook?.id || "new")}
                  onSubmit={handleSaveBook}
                  onCancel={() => setFormMode("hidden")}
                  defaultValues={editingBook || {}}
                />
              </div>
            )}

            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden shadow-2xl">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-gray-300 uppercase text-sm">
                  <tr>
                    <th className="px-6 py-4 text-center">STT</th>
                    <th className="px-6 py-4">Tên Sách</th>
                    <th className="px-6 py-4">Tác Giả</th>
                    <th className="px-6 py-4">Tồn</th>
                    <th className="px-6 py-4">Đơn Giá</th>
                    <th className="px-6 py-4 text-center">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-white">
                  {books.map((b, i) => (
                    <tr
                      key={b.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 text-center">
                        <span className="bg-blue-500/20 w-8 h-8 rounded-full inline-flex items-center justify-center text-sm">
                          {i + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium">{b.tenSach}</td>
                      <td className="px-6 py-4 text-gray-400">{b.tacGia}</td>
                      <td className="px-6 py-4">{b.soLuong}</td>
                      <td className="px-6 py-4">{formatMoney(b.donGia)}đ</td>
                      <td className="px-6 py-4 flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setEditingBook(b);
                            setFormMode("edit");
                          }}
                          className="p-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() =>
                            deleteBook(b.id) &&
                            showToast(
                              "success",
                              "Đã xóa",
                              "Xóa sách thành công"
                            )
                          }
                          className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- INVOICE TAB --- */}
        {activeTab === "invoice" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
            <div className="lg:col-span-7 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 h-fit max-h-[80vh] flex flex-col">
              <h2 className="text-2xl font-bold text-white mb-4">
                📚 Chọn Sản Phẩm
              </h2>
              <div className="overflow-y-auto custom-scrollbar pr-2 space-y-3 flex-1">
                {books.map((b) => (
                  <div
                    key={b.id}
                    className="bg-white/5 p-4 rounded-xl border border-white/10 flex justify-between items-center group hover:bg-white/10 transition-all"
                  >
                    <div>
                      <h4 className="text-white font-bold">{b.tenSach}</h4>
                      <div className="text-green-400 text-sm mt-1">
                        {formatMoney(b.donGia)}đ{" "}
                        <span className="text-gray-500 ml-2">
                          (Kho: {b.soLuong})
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        addToCart(b);
                        showToast("success", "Đã thêm", `Thêm ${b.tenSach}`);
                      }}
                      disabled={b.soLuong === 0}
                      className={`px-4 py-2 rounded-lg font-bold text-sm ${
                        b.soLuong > 0
                          ? "bg-blue-600 text-white hover:bg-blue-500"
                          : "bg-gray-700 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {b.soLuong > 0 ? "+ Thêm" : "Hết hàng"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6">
                <h3 className="text-white font-bold mb-3">👤 Khách Hàng</h3>
                <div className="space-y-3">
                  <input
                    value={customer.name}
                    onChange={(e) =>
                      setCustomer({ ...customer, name: e.target.value })
                    }
                    placeholder="Tên khách hàng"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-green-500"
                  />
                  <input
                    value={customer.phone}
                    onChange={(e) =>
                      setCustomer({ ...customer, phone: e.target.value })
                    }
                    placeholder="Số điện thoại"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-green-500"
                  />
                  <input
                    value={customer.address}
                    onChange={(e) =>
                      setCustomer({ ...customer, address: e.target.value })
                    }
                    placeholder="Địa chỉ"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-green-500"
                  />
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 flex-1 flex flex-col">
                <h2 className="text-2xl font-bold text-white mb-4 flex justify-between">
                  <span>🧾 Hóa Đơn</span>
                  <span className="text-sm font-normal text-gray-400">
                    {cart.length} sp
                  </span>
                </h2>
                <div className="flex-1 overflow-y-auto custom-scrollbar mb-4 space-y-3 max-h-[400px]">
                  {cart.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      Giỏ hàng trống
                    </div>
                  )}
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center bg-black/20 p-3 rounded-xl border border-white/5"
                    >
                      <div className="flex-1 text-white text-sm font-medium">
                        {item.tenSach}
                      </div>
                      <div className="flex items-center gap-2 bg-white/10 rounded px-2 py-1 mx-2">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="text-gray-300 hover:text-white px-1"
                        >
                          -
                        </button>
                        <span className="text-white font-bold text-sm min-w-4 text-center">
                          {item.buyQuantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="text-gray-300 hover:text-white px-1"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 font-bold text-sm">
                          {formatMoney(item.buyQuantity * item.donGia)}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-400 text-xs hover:underline"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/10 pt-4 mt-auto">
                  <div className="flex justify-between items-end mb-4 text-white">
                    <span>Tổng cộng:</span>
                    <span className="text-2xl font-bold text-red-500">
                      {formatMoney(total)}đ
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={clearCart}
                      className="bg-white/5 text-gray-300 py-3 rounded-xl font-bold hover:bg-white/10"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleCheckout}
                      className="bg-linear-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-green-500/50"
                    >
                      Thanh Toán
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookManager;
