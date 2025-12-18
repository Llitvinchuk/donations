"use client";

import { useMemo, useState } from "react";
import Modal from "@/components/ui/Modal";
import MaskedField from "@/components/ui/MaskedField";
import {
  formatCard,
  formatPhone,
  isCardComplete,
  isPhoneComplete,
  maskCardDisplay,
  maskPhoneDisplay,
  onlyDigits,
} from "@/lib/masks";
import Image from "next/image";

type HistoryItem = {
  id: string;
  amount: number;
  label: string;
  date: string;
};

const historyMock: HistoryItem[] = [
  { id: "1", amount: -12199, label: "Вывод средств", date: "12.04.2025 18:34" },
  { id: "2", amount: 99, label: "Донат", date: "11.04.2025 12:54" },
  { id: "3", amount: 57, label: "Донат", date: "10.04.2025 09:00" },
  { id: "4", amount: 653, label: "Донат", date: "09.04.2025 15:45" },
  { id: "5", amount: 321, label: "Донат", date: "08.04.2025 10:30" },
  { id: "6", amount: 1200, label: "Донат", date: "07.04.2025 20:00" },
  { id: "7", amount: -350, label: "Оплата подписки", date: "06.04.2025 14:15" },
];

function formatRub(amount: number) {
  const sign = amount < 0 ? "-" : "+";
  const abs = Math.abs(amount);
  const s = abs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${sign}${s} ₽`;
}

type CardState = "empty" | "editing" | "saved";

export default function DonationsScreen() {
  const [donationsEnabled, setDonationsEnabled] = useState(false);
  const [agree, setAgree] = useState(false);

  const [phoneDigits, setPhoneDigits] = useState("");
  const [phoneLocked, setPhoneLocked] = useState(false);
  const [phoneError, setPhoneError] = useState(false);

  const [cardDigits, setCardDigits] = useState("");
  const [cardError, setCardError] = useState(false);
  const [cardState, setCardState] = useState<CardState>("empty");

  const [confirmOpen, setConfirmOpen] = useState(false);

  const total7days = 2330;

  const phoneDisplay = useMemo(() => {
    if (!phoneDigits) return "+7";

    if (phoneLocked) {
      return maskPhoneDisplay(phoneDigits);
    }

    return "+7 " + phoneDigits;
  }, [phoneDigits, phoneLocked]);

  const cardDisplay = useMemo(() => {
    if (cardState === "saved" && cardDigits) return maskCardDisplay(cardDigits);
    return cardDigits ? formatCard(cardDigits) : "";
  }, [cardDigits, cardState]);
  function onPhoneChange(input: string) {
    let d = onlyDigits(input);

    if (d.startsWith("7")) {
      d = d.slice(1);
    }

    setPhoneDigits(d.slice(0, 10));
    setPhoneError(false);
  }

  function onPhoneBlur() {
    if (phoneLocked) return;
    if (!phoneDigits) return;

    if (!isPhoneComplete(phoneDigits)) {
      setPhoneError(true);
      return;
    }

    setPhoneLocked(true);
    setPhoneError(false);
  }

  function onCardChange(input: string) {
    const d = onlyDigits(input).slice(0, 16);
    setCardDigits(d);
    setCardError(false);
  }

  function onCardBlur() {
    if (cardState !== "editing") return;
    if (!cardDigits) return;

    if (!isCardComplete(cardDigits)) {
      setCardError(true);
      return;
    }

    setCardState("saved");
    setCardError(false);
  }

  const canConnect = agree;

  function connectDonations() {
    if (!canConnect) return;
    setDonationsEnabled(true);
  }

  function disableDonations() {
    setDonationsEnabled(false);

    setPhoneDigits("");
    setPhoneLocked(false);
    setPhoneError(false);

    setCardDigits("");
    setCardState("empty");
    setCardError(false);

    setConfirmOpen(false);
  }

  const hasRequisites =
    (phoneDigits && phoneLocked) || (cardState === "saved" && cardDigits);

  return (
    <div className="px-6 pb-16 pt-26">
      <div className="mx-auto max-w-[1360px]">
        <h1 className="text-[40px] font-black tracking-tight">
          КАБИНЕТ АВТОРА
        </h1>

        <div className="mt-4 rounded-2xl bg-white px-6 py-4 shadow-[0_1px_0_#E5E7EB]">
          <div className="flex gap-8 text-[16px] py-2 text-[#898989]">
            <button className="hover:text-[#111827]">Мои работы</button>
            <button className="relative font-medium text-[#111827]">
              Донаты
              <span className="absolute -bottom-3 left-0 h-[2px] w-full rounded bg-[#4F46E5]" />
            </button>
            <button className="hover:text-[#111827]">Продвижение</button>
            <button className="hover:text-[#111827]">Статистика</button>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center">
          <div className="grid w-full max-w-[640px] place-items-center">
            <div className="max-w-[440px] w-full items-center flex flex-col">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#E3E5ED] text-[#4F46E5]">
                <Image src="CurrencyRub.svg" alt="₽" width={24} height={24} />
              </div>

              {donationsEnabled ? (
                <>
                  <div className="mt-6 text-center text-xl font-semibold">
                    Мои реквизиты
                  </div>

                  <div className="mt-6 text-base w-full space-y-5">
                    <MaskedField
                      label="1. Номер телефона"
                      hint="Номер телефона необходимо указать согласно законам РФ для получения пожертвований. Платформа TaleStorm не будет иметь доступа к вашему контактному номеру."
                      valueDigits={phoneDigits}
                      displayValue={phoneDisplay}
                      placeholder="+7 ___ ___ __ __"
                      locked={phoneLocked}
                      error={phoneError}
                      onChangeDigits={onPhoneChange}
                      onBlurValidate={onPhoneBlur}
                      onEdit={() => {
                        setPhoneLocked(false);
                        setPhoneError(false);
                      }}
                      onClear={() => {
                        setPhoneDigits("");
                        setPhoneLocked(false);
                        setPhoneError(false);
                      }}
                    />

                    {cardState === "empty" && (
                      <div>
                        <div className="mb-2 flex items-center gap-2">
                          <div className="text-base font-medium text-[#6C7286]">
                            2. Банковская карта
                          </div>
                          <span className="text-[#9CA3AF]">
                            <span className="text-[#9CA3AF] bg-white rounded-full h-4 w-4 flex justify-center border border-[#E7E8EF]">
                              <Image
                                src="QuestionMark.svg"
                                alt="₽"
                                width={13}
                                height={13}
                              />
                            </span>
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setCardState("editing");
                            setCardDigits("");
                            setCardError(false);
                          }}
                          className="h-10 rounded-xl bg-[#505CFF] px-9 text-sm font-normal text-white hover:bg-[#4338CA]"
                        >
                          Подключить
                        </button>

                        <div className="mt-2 text-xs font-normal leading-relaxed text-[#6B7280]">
                          У платформы TaleStorm нет и не будет доступа к
                          реквизитам Вашей карты. Они хранятся на стороне
                          Банка-партнёра, отвечающего за переводы.
                        </div>
                      </div>
                    )}

                    {cardState === "editing" && (
                      <MaskedField
                        label="2. Банковская карта"
                        hint="У платформы TaleStorm нет и не будет доступа к реквизитам Вашей карты. Они хранятся на стороне Банка-партнёра, отвечающего за переводы."
                        valueDigits={cardDigits}
                        displayValue={cardDisplay}
                        placeholder="____ ____ ____ ____"
                        locked={false}
                        error={cardError}
                        onChangeDigits={onCardChange}
                        onBlurValidate={onCardBlur}
                        onEdit={() => {}}
                        onClear={() => {
                          setCardDigits("");
                          setCardError(false);
                          setCardState("empty");
                        }}
                      />
                    )}

                    {cardState === "saved" && (
                      <MaskedField
                        label="2. Банковская карта"
                        hint="У платформы TaleStorm нет и не будет доступа к реквизитам Вашей карты. Они хранятся на стороне Банка-партнёра, отвечающего за переводы."
                        valueDigits={cardDigits}
                        displayValue={cardDisplay}
                        placeholder="____ ____ ____ ____"
                        locked={true}
                        error={false}
                        onChangeDigits={() => {}}
                        onBlurValidate={() => {}}
                        onEdit={() => {
                          setCardState("editing");
                          setCardError(false);
                        }}
                        onClear={() => {
                          setCardDigits("");
                          setCardError(false);
                          setCardState("empty");
                        }}
                      />
                    )}
                    {hasRequisites && (
                      <div className="flex justify-center pt-1">
                        <button
                          onClick={() => setConfirmOpen(true)}
                          className="h-11 rounded-xl bg-[#FF3B301A]/90 px-6 text-[14px] font-medium text-[#FF3B30] hover:bg-[#FECACA]"
                        >
                          Отключить донаты
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="mt-6 max-w-[520px] text-center text-xl font-semibold leading-snug">
                    Активируйте прием донатов и любой пользователь платформы
                    сможет отправить Вам пожертвование буквально в 1 клик!
                  </div>

                  <div className="flex flex-col align-baseline mt-2 space-y-3 text-[13px] text-[#6C7286]">
                    <div className="flex gap-2">
                      <span className="grid h-6 w-6 place-items-center rounded-md bg-white shadow-[0_1px_0_#E5E7EB]">
                        <Image
                          src="Cardholder.svg"
                          alt="₽"
                          width={13}
                          height={13}
                        />
                      </span>
                      <p className="text-sm text-[#6C7286]">
                        Прием денег на{" "}
                        <span className="font-bold">любую карту РФ банка</span>
                      </p>
                      <span className="text-[#9CA3AF] bg-white rounded-full h-4 w-4 flex justify-center border border-[#E7E8EF]">
                        <Image
                          src="QuestionMark.svg"
                          alt="₽"
                          width={13}
                          height={13}
                        />
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="grid h-6 w-6 place-items-center rounded-md bg-white shadow-[0_1px_0_#E5E7EB]">
                        <Image
                          src="HandHeart.svg"
                          alt="₽"
                          width={13}
                          height={13}
                        />
                      </span>
                      <p className="text-sm text-[#6C7286]">
                        Пожертвования{" "}
                        <span className="font-bold">
                          не облагаются налогами
                        </span>
                      </p>

                      <span className="text-[#9CA3AF] bg-white rounded-full h-4 w-4 flex justify-center border border-[#E7E8EF]">
                        <Image
                          src="QuestionMark.svg"
                          alt="₽"
                          width={13}
                          height={13}
                        />
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="grid h-6 w-6 place-items-center rounded-md bg-white shadow-[0_1px_0_#E5E7EB]">
                        <Image
                          src="Checks.svg"
                          alt="₽"
                          width={13}
                          height={13}
                        />
                      </span>
                      <p className="text-sm font-bold text-[#6C7286]">
                        Мгновенные{" "}
                        <span className="font-normal">зачисления</span>
                      </p>

                      <span className="text-[#9CA3AF] bg-white rounded-full h-4 w-4 flex justify-center border border-[#E7E8EF]">
                        <Image
                          src="QuestionMark.svg"
                          alt="₽"
                          width={13}
                          height={13}
                        />
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={connectDonations}
                    disabled={!canConnect}
                    className={[
                      "mt-6 h-11 rounded-xl px-6 text-[14px] font-normal",
                      canConnect
                        ? "bg-[#505CFF] text-white hover:bg-[#4338CA]"
                        : "bg-[#505CFF4D] text-white font-normal cursor-not-allowed",
                    ].join(" ")}
                  >
                    Подключить донаты
                  </button>

                  <label className="mt-3 self-baseline flex items-start gap-2 text-[12px]">
                    <input
                      name="checkbox"
                      type="checkbox"
                      checked={agree}
                      onChange={(e) => setAgree(e.target.checked)}
                      className="accent-[#505CFF] border mt-0.5 h-4 w-4 rounded border-[#DEE1EA] bg-transparent"
                    />
                    <span className="text-black font-normal">
                      Я соглашаюсь с Условиями использования <br />и
                      Пользовательским соглашением
                    </span>
                  </label>
                </>
              )}
            </div>

            <div className="mt-19 w-full">
              <div className="text-left text-[22px] font-black tracking-tight">
                {donationsEnabled
                  ? "ИСТОРИЯ ЗАЧИСЛЕНИЙ:"
                  : "ТАК МОЖЕТ ВЫГЛЯДЕТЬ ВАША ИСТОРИЯ ЗАЧИСЛЕНИЙ:"}
              </div>

              <div className="mt-7 text-left text-xl font-semibold text-[#6C7286]">
                Всего получено за последние 7 дней:{" "}
                <span className="text-[#111827]">
                  {total7days.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}{" "}
                  руб.
                </span>
              </div>

              <div className="mt-4 space-y-1">
                {historyMock.map((h) => (
                  <div
                    key={h.id}
                    className="flex items-center justify-between rounded-2xl bg-white px-5 py-4"
                  >
                    <div>
                      <div className="text-base font-medium">
                        {formatRub(h.amount)}
                      </div>
                      <div className="text-xs text-[#9CA3AF]">{h.label}</div>
                    </div>
                    <div className="text-xs text-[#9CA3AF]">{h.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={confirmOpen}
        title="Вы действительно хотите отключить донаты?"
        subtitle="Читатели больше не смогут отправлять вам пожертвования"
        onClose={() => setConfirmOpen(false)}
        onConfirm={disableDonations}
        confirmText="Отключить донаты"
      />
    </div>
  );
}
