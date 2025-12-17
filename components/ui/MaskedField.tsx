"use client";

import { PencilIcon, TrashIcon } from "@/components/icons";
import Image from "next/image";

type Props = {
  label: string;
  hint?: string;
  valueDigits: string;
  displayValue: string;
  placeholder?: string;

  locked: boolean;
  error: boolean;

  onChangeDigits: (value: string) => void;
  onBlurValidate: () => void;

  onEdit: () => void;
  onClear: () => void;
};

export default function MaskedField({
  label,
  hint,
  displayValue,
  placeholder,
  locked,
  error,
  onChangeDigits,
  onBlurValidate,
  onEdit,
  onClear,
}: Props) {
  return (
    <div>
      <div className="flex gap-2 items-center mb-2">
        <div className=" text-base font-medium text-[#6C7286]">{label}</div>
        <span className="text-[#9CA3AF] bg-white rounded-full h-4 w-4 flex justify-center border border-[#E7E8EF]">
          <Image src="QuestionMark.svg" alt="₽" width={13} height={13} />
        </span>
      </div>
      <div
        className={[
          "flex items-center gap-2 rounded-xl border bg-white px-3",
          error
            ? "border-red-500 ring-1 ring-red-500/30"
            : "border-[#DEE1EA] focus-within:ring-2 focus-within:ring-[#6366F1]/20",
        ].join(" ")}
      >
        <input
          value={displayValue}
          placeholder={placeholder}
          readOnly={locked}
          onChange={(e) => onChangeDigits(e.target.value)}
          onBlur={onBlurValidate}
          className="h-10 w-full bg-transparent text-[14px] outline-none placeholder:text-xs placeholder:text-[#6C7286]"
        />

        <button
          type="button"
          onClick={onEdit}
          className="grid h-[24px]  w-[30px] place-items-center rounded-lg bg-[#F2F3F7]"
        >
          <Image src="PencilSimple.svg" alt="₽" width={14} height={14} />
        </button>

        <button
          type="button"
          onClick={onClear}
          className="grid h-[24px] w-[30px] place-items-center rounded-lg bg-[#FEE2E2] text-[#EF4444]"
        >
          <Image src="Trash.svg" alt="₽" width={14} height={14} />
        </button>
      </div>

      {hint && <div className="mt-2 text-[12px] text-[#6B7280]">{hint}</div>}
    </div>
  );
}
