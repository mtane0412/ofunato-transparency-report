/**
 * Selectコンポーネント
 *
 * セレクトボックスを提供します。
 */

export interface SelectOption {
  /** オプションの値 */
  value: string;
  /** オプションのラベル */
  label: string;
  /** オプションの件数（指定した場合、ラベルに表示される） */
  count?: number;
}

export interface SelectProps {
  /** セレクトボックスのID */
  id: string;
  /** ラベルテキスト */
  label: string;
  /** 選択肢の配列 */
  options: SelectOption[];
  /** 現在選択されている値 */
  value: string;
  /** 値変更時のコールバック */
  onChange: (value: string) => void;
  /** プレースホルダーテキスト（デフォルト: "すべて"） */
  placeholder?: string;
  /** 無効化フラグ */
  disabled?: boolean;
}

/**
 * セレクトボックスコンポーネント
 */
export function Select({
  id,
  label,
  options,
  value,
  onChange,
  placeholder = 'すべて',
  disabled = false,
}: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => {
          // 件数が指定されている場合、ラベルに追加
          const displayLabel =
            option.count !== undefined ? `${option.label} (${option.count}件)` : option.label;
          // 件数が0の場合は無効化
          const isDisabled = option.count === 0;

          return (
            <option key={option.value} value={option.value} disabled={isDisabled}>
              {displayLabel}
            </option>
          );
        })}
      </select>
    </div>
  );
}
