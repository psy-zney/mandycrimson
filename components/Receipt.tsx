import type { OrderData, ProductItem } from '../types';
import { translations } from '../translations';

interface ReceiptProps {
  data: OrderData;
}

export default function Receipt({ data }: ReceiptProps) {
  // import.meta.env.BASE_URL sẽ lấy giá trị 'base' từ vite.config.ts
// Ví dụ: nếu base là '/mandycrimson/' thì đường dẫn sẽ tự đúng.
const currentLogo = `${import.meta.env.BASE_URL}logoMandy.png`;
  const productCount = data.products.length;
  const isPickup = data.mode === 'pickup';
  const t = isPickup ? translations.receipt.pickup : translations.receipt.international;

  // Cấu hình font chữ cho sản phẩm
  let productFontSize = '13.3px'; 
  let productLineHeight = '1.5';
  let listSpacing = 'space-y-1.5';
  
  // Thu nhỏ font nếu quá nhiều sản phẩm
  if (productCount > 25) {
    productFontSize = '10px';
    productLineHeight = '1.2';
    listSpacing = 'space-y-0.5';
  } else if (productCount > 15) {
    productFontSize = '11.5px';
    productLineHeight = '1.3';
    listSpacing = 'space-y-1';
  }

  return (
    <div className="receipt-page w-full flex flex-col items-center bg-transparent">
      {/* Container chuẩn khổ dọc */}
      <div className="bg-white w-[378px] h-[567px] border border-stone-100 p-8 flex flex-col relative text-black font-['Crimson_Pro'] overflow-hidden">

        {/* 1. LOGO */}
        <div className="flex-none w-full flex items-center justify-center pt-[5px] pb-[5px]">
          <img 
            src={currentLogo} 
            alt="Brand Logo" 
            className="object-contain w-[130px] h-auto max-h-[45px]"
          />
        </div>

        {/* 2. THÔNG TIN KHÁCH HÀNG */}
        <div className="flex-none w-full px-4 mb-2 text-[13.3px] leading-tight">
          <div className="space-y-0.5 border-l-0 pl-0">
            {/* Tên */}
            <p className="flex items-baseline">
              <span className="font-bold italic mr-1 shrink-0">{(t as any).fullName}:</span> 
              <span className="font-medium tracking-tight">{data.customerName || '...'}</span>
            </p>
            
            {isPickup ? (
              <>
                <p className="flex items-baseline">
                  <span className="font-bold italic mr-1 shrink-0">{(t as any).instagram}:</span> 
                  <span className="font-medium tracking-tight">{data.instagram || '...'}</span>
                </p>
                <p className="flex items-baseline">
                  <span className="font-bold italic mr-1 shrink-0">{(t as any).stt}:</span> 
                  <span className="font-medium tracking-tight">{data.serialNumber || '...'}</span>
                </p>
              </>
            ) : (
              <>
                <p className="flex items-baseline">
                  <span className="font-bold italic mr-1 shrink-0">{(t as any).phone}:</span> 
                  <span className="font-medium tracking-tight">{data.phone || '...'}</span>
                </p>
                <div className="flex items-start">
                  <span className="font-bold italic mr-1 shrink-0">{(t as any).address}:</span> 
                  <span className="break-words line-clamp-2 font-medium tracking-tight">{data.address || '...'}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* --- [MỚI] THANH GẠCH NỐI GIỮA (MÀU ĐEN) --- */}
        <div className="w-full px-4 mb-4">
            <div className="w-full border-t border-dashed border-black"></div>
        </div>

        {/* 3. TIÊU ĐỀ SẢN PHẨM */}
        <div className="flex-none w-full flex justify-center mb-6">
          {/* SỬA: decoration-black (gạch đen), decoration-2 (dày hơn), tracking-widest (thu hẹp khoảng cách chữ) */}
          <h3 className="font-bold underline underline-offset-8 decoration-2 decoration-black text-[13.3px] uppercase tracking-widest italic opacity-100">
            {t.products}
          </h3>
        </div>

        {/* 4. LIST SẢN PHẨM */}
        <div className="flex-grow w-full px-4 overflow-hidden flex flex-col min-h-0">
          <ul className={`${listSpacing} overflow-hidden px-6`}>
            {data.products.map((item: ProductItem) => (
              <li 
                key={item.id} 
                className="flex items-start"
                style={{ fontSize: productFontSize, lineHeight: productLineHeight }}
              >
                {/* TIM MÀU ĐEN */}
                <span className="mr-3 text-[10px] shrink-0 text-black mt-1.5">♡</span>
                <span className="font-medium break-words leading-relaxed">{item.name}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 5. FOOTER */}
        <div className="flex-none w-full mt-auto pt-4 pb-12">
          <div className="w-full px-4 mb-6">
             {/* SỬA: border-black (đen tuyền) thay vì stone-200 */}
            <div className="w-full border-t border-dashed border-black"></div>
          </div>
          <div className="w-full text-center px-4">
            <p className="italic text-[12px] font-medium text-stone-400 tracking-tight leading-relaxed">
              {t.footer}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}