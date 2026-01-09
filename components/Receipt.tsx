import type { OrderData, ProductItem } from '../types';
import { translations } from '../translations';

interface ReceiptProps {
  data: OrderData;
}

export default function Receipt({ data }: ReceiptProps) {
  // Lấy ảnh chuẩn GitHub Pages
  const currentLogo = `${import.meta.env.BASE_URL}logoMandy.png`;

  const productCount = data.products.length;
  const isPickup = data.mode === 'pickup';
  const t = isPickup ? translations.receipt.pickup : translations.receipt.international;

  // --- LOGIC CO GIÃN THÔNG MINH ---
  // Mặc định (Dưới 8 món)
  let styles = {
    prodFontSize: '13px',
    prodLineHeight: '1.5',
    listGap: 'space-y-1.5',
    headerPadding: 'pt-5',
    footerPadding: 'pb-6',
    logoSize: 'w-[120px]',
  };

  // Cấp độ 1: 8 - 14 món
  if (productCount >= 8 && productCount <= 14) {
    styles = {
      prodFontSize: '11.5px',
      prodLineHeight: '1.3',
      listGap: 'space-y-1',
      headerPadding: 'pt-4',
      footerPadding: 'pb-4',
      logoSize: 'w-[110px]',
    };
  } 
  // Cấp độ 2: 15 - 22 món
  else if (productCount > 14 && productCount <= 22) {
    styles = {
      prodFontSize: '10.5px',
      prodLineHeight: '1.2',
      listGap: 'space-y-0.5',
      headerPadding: 'pt-3',
      footerPadding: 'pb-3',
      logoSize: 'w-[100px]',
    };
  } 
  // Cấp độ 3: Trên 22 món
  else if (productCount > 22) {
    styles = {
      prodFontSize: '9.5px',
      prodLineHeight: '1.1',
      listGap: 'space-y-0',
      headerPadding: 'pt-2',
      footerPadding: 'pb-2',
      logoSize: 'w-[90px]',
    };
  }

  return (
    <div className="receipt-page flex justify-center items-center bg-transparent py-4 print:p-0">
      
      {/* KHUNG GIẤY 100mm x 150mm */}
      <div 
        className="
          bg-white 
          w-[100mm] h-[150mm] 
          flex flex-col justify-between 
          relative 
          text-black font-['Crimson_Pro'] 
          overflow-hidden 
          border border-stone-200 shadow-lg print:border-none print:shadow-none
        "
      >

        {/* === PHẦN 1: HEADER === */}
        <div className={`flex-none w-full px-6 ${styles.headerPadding}`}>
          
          {/* Logo */}
          <div className="w-full flex items-center justify-center mb-2">
            <img 
              src={currentLogo} 
              alt="Brand Logo" 
              className={`object-contain h-auto max-h-[50px] transition-all ${styles.logoSize}`}
            />
          </div>

          {/* Thông tin khách hàng */}
          <div className="w-full mb-2 text-[13px] leading-tight">
            <div className="space-y-0.5">
              {/* [FIX 1] Bỏ min-w để chữ chạy liền nhau + [FIX 2] Bỏ uppercase ở tên */}
              <p className="flex items-baseline">
                <span className="font-bold italic mr-1.5 shrink-0">{(t as any).fullName}:</span> 
                <span className="font-medium tracking-tight truncate">{data.customerName || '...'}</span>
              </p>
              
              {isPickup ? (
                <>
                  <p className="flex items-baseline">
                    <span className="font-bold italic mr-1.5 shrink-0">{(t as any).instagram}:</span> 
                    <span className="font-medium tracking-tight truncate">{data.instagram || '...'}</span>
                  </p>
                  <p className="flex items-baseline">
                    <span className="font-bold italic mr-1.5 shrink-0">{(t as any).stt}:</span> 
                    <span className="font-medium tracking-tight font-bold">{data.serialNumber || '...'}</span>
                  </p>
                </>
              ) : (
                <>
                  <p className="flex items-baseline">
                    <span className="font-bold italic mr-1.5 shrink-0">{(t as any).phone}:</span> 
                    <span className="font-medium tracking-tight">{data.phone || '...'}</span>
                  </p>
                  <div className="flex items-start">
                    <span className="font-bold italic mr-1.5 shrink-0">{(t as any).address}:</span> 
                    <span className="break-words line-clamp-2 font-medium tracking-tight text-[11px] leading-snug">
                      {data.address || '...'}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="w-full border-t border-dashed border-black mb-1"></div>

          {/* [FIX 3] Tiêu đề sản phẩm: Pickup ẩn số, International hiện số */}
          <div className="w-full flex justify-center mb-1">
            <h3 className="font-bold underline underline-offset-2 decoration-1 decoration-black text-[11px] uppercase tracking-[0.2em] italic">
              {t.products} {isPickup ? '' : `(${productCount})`}
            </h3>
          </div>
        </div>

        {/* === PHẦN 2: DANH SÁCH SẢN PHẨM === */}
        <div className="flex-1 w-full px-6 overflow-hidden flex flex-col min-h-0 relative">
          <ul className={`${styles.listGap} px-1 w-full`}>
            {data.products.map((item: ProductItem) => (
              <li 
                key={item.id} 
                className="flex items-start w-full"
                style={{ fontSize: styles.prodFontSize, lineHeight: styles.prodLineHeight }}
              >
                <span className="mr-1.5 text-[9px] shrink-0 text-black mt-[2px]">♡</span>
                <span className="font-medium break-words leading-relaxed line-clamp-2">
                  {item.name}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* === PHẦN 3: FOOTER === */}
        <div className={`flex-none w-full px-6 ${styles.footerPadding}`}>
          <div className="w-full border-t border-dashed border-black mb-2"></div>
          <div className="w-full text-center">
            <p className="italic text-[10px] font-medium text-black tracking-wide">
              {t.footer}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}