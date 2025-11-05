'use client';

interface RememberMeCheckboxProps {
  id?: string;
  name?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function RememberMeCheckbox({
  id = 'rememberMe',
  name = 'rememberMe',
  checked,
  onChange,
  disabled = false,
  className = '',
}: RememberMeCheckboxProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <input
        id={id}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      />
      <label
        htmlFor={id}
        className="ml-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none"
      >
        Remember me
      </label>
    </div>
  );
}
