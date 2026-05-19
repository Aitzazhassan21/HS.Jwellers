import PropTypes from "prop-types";
import { Minus, Plus, Trash2 } from "lucide-react";
import formatPKR from "../../utils/formatPKR.js";
import { getProductImage } from "../../utils/imageHelpers.js";

const CartItem = ({ item, onIncrease, onDecrease, onRemove }) => {
  const imageUrl = getProductImage(item);
  
  return (
    <div className="grid grid-cols-[72px_1fr_auto] gap-3 rounded-xl border border-border bg-white p-3">
      <div className="h-[72px] w-[72px] overflow-hidden rounded-lg bg-[#FFF8E7]">
        {imageUrl ? (
          <img src={imageUrl} alt={item.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-[10px] text-text-muted">Image</div>
        )}
      </div>

      <div>
        <p className="line-clamp-2 text-sm font-medium text-text-dark">{item.name}</p>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-semibold text-[#debc65]">{formatPKR(item.price)}</span>
          {item.originalPrice > item.price && (
            <span className="text-xs text-text-muted line-through">{formatPKR(item.originalPrice)}</span>
          )}
        </div>
        <div className="mt-2 inline-flex items-center rounded-full border border-border">
          <button type="button" onClick={onDecrease} className="px-2 py-1 text-text-muted hover:text-[#debc65]">
            <Minus size={14} />
          </button>
          <span className="min-w-[28px] text-center text-xs font-semibold text-text-dark">{item.quantity}</span>
          <button type="button" onClick={onIncrease} className="px-2 py-1 text-text-muted hover:text-[#debc65]">
            <Plus size={14} />
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="self-start rounded-full p-1.5 text-text-muted transition-colors hover:bg-[#FFF8E7] hover:text-[#debc65]"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
};

CartItem.propTypes = {
  item: PropTypes.shape({
    productId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string,
    price: PropTypes.number.isRequired,
    originalPrice: PropTypes.number,
    quantity: PropTypes.number.isRequired,
  }).isRequired,
  onIncrease: PropTypes.func.isRequired,
  onDecrease: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default CartItem;
