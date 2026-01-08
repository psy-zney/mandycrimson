
import { useState, ChangeEvent } from 'react';
import * as XLSX from 'xlsx';
import Receipt from './components/Receipt';
import type { OrderData, ProductItem, OrderMode } from './types';
import { translations } from './translations';

export default function App() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [mode, setMode] = useState<OrderMode>('pickup');

  const t = translations;

  const processExcel = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as Record<string, any>[];

        const formattedOrders: OrderData[] = jsonData.map((row, index) => {
          const findValue = (row: Record<string, any>, keys: string[]): any => {
            for (const key of keys) {
              if (row[key] !== undefined) return row[key];
            }
            const rowKeys = Object.keys(row);
            for (const key of keys) {
              const normalizedKey = key.toLowerCase().trim();
              const foundKey = rowKeys.find(rk => rk.toLowerCase().trim() === normalizedKey);
              if (foundKey) return row[foundKey];
            }
            return null;
          };

          const customerName = findValue(row, ['Name', 'Họ và tên', 'Tên', 'Customer', 'Full Name']) || '';
          const rawProducts = findValue(row, ['Sản phẩm', 'Products', 'Items', 'Product']) || '';
          
          // Xử lý sản phẩm chung cho cả 2 mode
          const productList: ProductItem[] = String(rawProducts)
            .split(/\r?\n| - | – | — /) 
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map((name, i) => ({
              id: `${index}-${i}`,
              name: name.replace(/^[-\*\+]\s?/, '')
            }));

          if (mode === 'pickup') {
            const instagram = findValue(row, ['Tên IG', 'IG', 'instagram', 'Tên ig']) || 'n/a';
            const stt = findValue(row, ['STT', 'stt', 'No.']) || (index + 1).toString();
            return {
              mode: 'pickup',
              customerName: String(customerName),
              instagram: String(instagram),
              serialNumber: String(stt),
              products: productList,
              footerNote: t.receipt.pickup.footer
            };
          } else {
            const phone = findValue(row, ['Phone', 'SĐT', 'Số điện thoại', 'Phone Number']) || '...';
            const address = findValue(row, ['Address', 'Địa chỉ', 'Diachi']) || '...';
            return {
              mode: 'international',
              customerName: String(customerName),
              phone: String(phone),
              address: String(address),
              products: productList,
              footerNote: t.receipt.international.footer
            };
          }
        });

        setOrders(formattedOrders);
      } catch (err) {
        console.error(err);
        alert("Lỗi khi đọc file Excel!");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleModeChange = (newMode: OrderMode) => {
    setMode(newMode);
    setOrders([]); // Xoá danh sách cũ khi đổi chế độ để tránh nhầm lẫn
    setFileName(null);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#fcfcfc] font-['Crimson_Pro']">
      {/* Sidebar Control */}
      <div className="no-print w-full lg:w-[320px] bg-white border-r border-stone-100 p-8 flex flex-col h-screen sticky top-0 z-50">
        
        {/* State Toggle */}
        <div className="flex bg-stone-50 p-1 rounded-full mb-8 border border-stone-100">
          <button 
            onClick={() => handleModeChange('pickup')}
            className={`flex-1 py-2 text-[10px] font-bold tracking-[0.2em] rounded-full transition-all uppercase ${mode === 'pickup' ? 'bg-black text-white shadow-lg' : 'text-stone-400 hover:text-stone-600'}`}
          >
            Pickup
          </button>
          <button 
            onClick={() => handleModeChange('international')}
            className={`flex-1 py-2 text-[10px] font-bold tracking-[0.2em] rounded-full transition-all uppercase ${mode === 'international' ? 'bg-black text-white shadow-lg' : 'text-stone-400 hover:text-stone-600'}`}
          >
            Intl
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-10 tracking-[0.1em] text-center italic border-b border-stone-50 pb-6">{t.engineName}</h2>
        
        <div className="space-y-8">
          {/* Logo Display */}
          <div className="border border-stone-100 rounded-lg p-6 bg-stone-50 flex justify-center items-center">
            <img src="logoMandy.png" alt="Mandy Logo" className="max-h-10 object-contain grayscale opacity-60" />
          </div>

          {/* Excel Upload Section */}
          <div className="relative group border border-dashed border-stone-300 rounded-xl p-8 text-center hover:border-black hover:bg-white transition-all cursor-pointer bg-stone-50/50">
            <div className="text-3xl mb-4 opacity-30">📂</div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] leading-relaxed">
              {fileName || (mode === 'pickup' ? t.chooseExcel.pickup : t.chooseExcel.international)}
            </p>
            <input type="file" accept=".xlsx,.xls,.csv" className="absolute inset-0 opacity-0 cursor-pointer" onChange={processExcel} />
          </div>

          {orders.length > 0 && (
            <div className="p-4 bg-stone-900 text-white rounded-lg text-center animate-fade-in shadow-xl">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase italic">
                {orders.length} {mode === 'pickup' ? t.labelsReady.pickup : t.labelsReady.international}
              </p>
            </div>
          )}
        </div>

        <div className="mt-auto pt-8">
          {orders.length > 0 && (
            <button 
              onClick={() => window.print()}
              className="w-full py-4 bg-black text-white rounded-full text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-stone-800 transition-all active:scale-95 shadow-2xl"
            >
              {mode === 'pickup' ? t.printAll.pickup : t.printAll.international}
            </button>
          )}
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 p-6 lg:p-12 overflow-y-auto flex flex-col items-center bg-[#f9f9f9]">
        {orders.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-stone-300 text-center select-none">
            <div className="text-7xl mb-6 opacity-10 italic font-bold">M</div>
            <p className="italic text-[12px] tracking-[0.4em] uppercase opacity-30">{t.emptyState}</p>
          </div>
        ) : (
          <div className="print-container w-full flex flex-col items-center space-y-16">
            {orders.map((order, i) => (
              <Receipt key={i} data={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
