"use client";

import { createContext, useContext } from "react";

export type Lang = "az" | "en";

const LANG_KEY = "gc_lang";

export function getSavedLang(): Lang {
  if (typeof window === "undefined") return "az";
  return (localStorage.getItem(LANG_KEY) as Lang) ?? "az";
}

export function saveLang(lang: Lang): void {
  localStorage.setItem(LANG_KEY, lang);
}

// ── Translation strings ───────────────────────────────────────
export interface Translations {
  // General
  appName: string;
  appTagline: string;
  loading: string;
  goHome: string;
  backToHome: string;
  notFound: string;
  groupNotFound: string;
  settings: string;
  language: string;
  currency: string;
  save: string;
  cancel: string;
  edit: string;
  delete: string;
  confirm: string;
  deleteConfirm: string;

  // Home page
  createNewGroup: string;
  yourGroups: string;
  howItWorks: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;

  // Groups
  createGroup: string;
  groupNameLabel: string;
  groupNamePlaceholder: string;
  groupNameRequired: string;
  startGroupDesc: string;
  failedCreateGroup: string;
  deleteGroupConfirm: string;
  editGroupName: string;

  // Members
  members: string;
  addMember: string;
  memberName: string;
  memberNamePlaceholder: string;
  memberNameRequired: string;
  noMembers: string;
  failedAddMember: string;
  deleteMemberConfirm: string;
  memberHasExpenses: string;

  // Expenses
  expenses: string;
  addExpense: string;
  expenseTitle: string;
  expenseTitlePlaceholder: string;
  amount: string;
  paidBy: string;
  selectPayer: string;
  splitBetween: string;
  all: string;
  none: string;
  selectParticipant: string;
  noExpenses: string;
  failedAddExpense: string;
  deleteExpenseConfirm: string;
  splitBetweenLabel: string;
  perPerson: string;

  // Balances
  balances: string;
  member: string;
  paid: string;
  owed: string;
  net: string;
  noBalances: string;

  // Settlements
  settlement: string;
  optimalSettlements: string;
  allSettled: string;
  noPaymentsNeeded: string;
  settlementFooter: string;

  // Date
  expenseDate: string;

  // Base currency
  baseCurrency: string;
  baseCurrencyDesc: string;
  exchangeRates: string;
  exchangeRatesDesc: string;
  ratePerUnit: string;
  resetDefaults: string;

  // Misc
  addAtLeastOneMember: string;
  nMembersNExpenses: (members: number, expenses: number) => string;
}

const az: Translations = {
  appName: "Qrup Kalkulyator",
  appTagline: "Dostlarla xərcləri bölün",
  loading: "Yüklənir...",
  goHome: "Ana Səhifə",
  backToHome: "\u2190 Ana Səhifəyə",
  notFound: "404",
  groupNotFound: "Qrup tapılmadı.",
  settings: "Parametrlər",
  language: "Dil",
  currency: "Valyuta",
  save: "Yadda saxla",
  cancel: "Ləğv et",
  edit: "Redaktə",
  delete: "Sil",
  confirm: "Təsdiq et",
  deleteConfirm: "Silmək istədiyinizə əminsiniz?",

  createNewGroup: "Yeni Qrup Yarat",
  yourGroups: "Qruplarınız",
  howItWorks: "Necə İşləyir",
  step1Title: "Qrup Yarat",
  step1Desc: "Səfər və ya tədbirinizə ad verin",
  step2Title: "Xərclər Əlavə Et",
  step2Desc: "Kimin nə ödədiyini izləyin",
  step3Title: "Hesablaşın",
  step3Desc: "Kimin kimə borclu olduğunu görün",

  createGroup: "Qrup Yarat",
  groupNameLabel: "Qrup Adı",
  groupNamePlaceholder: "məs. Yay Səfəri 2026",
  groupNameRequired: "Qrup adı tələb olunur",
  startGroupDesc: "Dostlarla xərclərini bölmək üçün qrup yaradın.",
  failedCreateGroup: "Qrup yaradılmadı.",
  deleteGroupConfirm: "Bu qrupu silmək istəyirsiniz? Bütün üzvlər və xərclər silinəcək.",
  editGroupName: "Qrup adını redaktə edin",

  members: "Üzvlər",
  addMember: "Üzv Əlavə Et",
  memberName: "Üzv Adı",
  memberNamePlaceholder: "Adını daxil edin",
  memberNameRequired: "Üzv adı tələb olunur",
  noMembers: "Hələ üzv yoxdur. Yuxarıdan əlavə edin!",
  failedAddMember: "Üzv əlavə edilmədi.",
  deleteMemberConfirm: "Bu üzvü silmək istəyirsiniz?",
  memberHasExpenses: "Bu üzvün xərcləri var, əvvəlcə onları silin.",

  expenses: "Xərclər",
  addExpense: "Xərc Əlavə Et",
  expenseTitle: "Başlıq",
  expenseTitlePlaceholder: "məs. Mario's-da şam yeməyi",
  amount: "Məbləğ",
  paidBy: "Ödəyən",
  selectPayer: "Ödəyəni seçin...",
  splitBetween: "Arasında Bölün",
  all: "Hamısı",
  none: "Heç biri",
  selectParticipant: "Ən azı bir iştirakçı seçin",
  noExpenses: "Hələ xərc yoxdur. Yuxarıdan əlavə edin!",
  failedAddExpense: "Xərc əlavə edilmədi.",
  deleteExpenseConfirm: "Bu xərci silmək istəyirsiniz?",
  splitBetweenLabel: "Bölünür:",
  perPerson: "/nəfər",

  balances: "Balanslar",
  member: "Üzv",
  paid: "Ödəyib",
  owed: "Borclu",
  net: "Nəticə",
  noBalances: "Hələ balans yoxdur.",

  settlement: "Hesablaşma",
  optimalSettlements: "Optimal Hesablaşmalar",
  allSettled: "Hamısı hesablaşdı!",
  noPaymentsNeeded: "Ödəniş tələb olunmur.",
  settlementFooter: "Borcları hesablaşdırmaq üçün minimum əməliyyatlar.",

  expenseDate: "Tarix",

  baseCurrency: "Hesablama valyutası",
  baseCurrencyDesc: "Bütün xərclər bu valyutaya çevrilir",
  exchangeRates: "Valyuta məzənnələri",
  exchangeRatesDesc: "1 vahid = neçə AZN",
  ratePerUnit: "məzənnə",
  resetDefaults: "Sıfırla",

  addAtLeastOneMember: "Xərc əlavə etmədən əvvəl ən azı bir üzv əlavə edin.",
  nMembersNExpenses: (m, e) =>
    `${m} üzv \u00B7 ${e} xərc`,
};

const en: Translations = {
  appName: "Group Calculator",
  appTagline: "Split expenses with friends",
  loading: "Loading...",
  goHome: "Go Home",
  backToHome: "\u2190 Back to Home",
  notFound: "404",
  groupNotFound: "Group not found.",
  settings: "Settings",
  language: "Language",
  currency: "Currency",
  save: "Save",
  cancel: "Cancel",
  edit: "Edit",
  delete: "Delete",
  confirm: "Confirm",
  deleteConfirm: "Are you sure you want to delete?",

  createNewGroup: "Create New Group",
  yourGroups: "Your Groups",
  howItWorks: "How It Works",
  step1Title: "Create Group",
  step1Desc: "Name your trip or event",
  step2Title: "Add Expenses",
  step2Desc: "Track who paid for what",
  step3Title: "Settle Up",
  step3Desc: "See who owes whom",

  createGroup: "Create Group",
  groupNameLabel: "Group Name",
  groupNamePlaceholder: "e.g. Summer Trip 2026",
  groupNameRequired: "Group name is required",
  startGroupDesc: "Start a group to split expenses with friends.",
  failedCreateGroup: "Failed to create group.",
  deleteGroupConfirm: "Delete this group? All members and expenses will be removed.",
  editGroupName: "Edit group name",

  members: "Members",
  addMember: "Add Member",
  memberName: "Member Name",
  memberNamePlaceholder: "Enter name",
  memberNameRequired: "Member name is required",
  noMembers: "No members yet. Add someone above!",
  failedAddMember: "Failed to add member.",
  deleteMemberConfirm: "Delete this member?",
  memberHasExpenses: "This member has expenses, delete those first.",

  expenses: "Expenses",
  addExpense: "Add Expense",
  expenseTitle: "Title",
  expenseTitlePlaceholder: "e.g. Dinner at Mario's",
  amount: "Amount",
  paidBy: "Paid By",
  selectPayer: "Select payer...",
  splitBetween: "Split Between",
  all: "All",
  none: "None",
  selectParticipant: "Select at least one participant",
  noExpenses: "No expenses yet. Add one above!",
  failedAddExpense: "Failed to add expense.",
  deleteExpenseConfirm: "Delete this expense?",
  splitBetweenLabel: "Split between:",
  perPerson: "/person",

  balances: "Balances",
  member: "Member",
  paid: "Paid",
  owed: "Owed",
  net: "Net",
  noBalances: "No balances to show yet.",

  settlement: "Settlement",
  optimalSettlements: "Optimal Settlements",
  allSettled: "All settled up!",
  noPaymentsNeeded: "No payments needed.",
  settlementFooter: "Suggested minimum transactions to settle all debts.",

  expenseDate: "Date",

  baseCurrency: "Settlement currency",
  baseCurrencyDesc: "All expenses are converted to this currency",
  exchangeRates: "Exchange rates",
  exchangeRatesDesc: "1 unit = how many AZN",
  ratePerUnit: "rate",
  resetDefaults: "Reset defaults",

  addAtLeastOneMember: "Add at least one member before creating an expense.",
  nMembersNExpenses: (m, e) =>
    `${m} member${m !== 1 ? "s" : ""} \u00B7 ${e} expense${e !== 1 ? "s" : ""}`,
};

export const translations: Record<Lang, Translations> = { az, en };

// ── React context ─────────────────────────────────────────────
export const I18nContext = createContext<Translations>(az);
export const LangContext = createContext<{
  lang: Lang;
  setLang: (lang: Lang) => void;
}>({ lang: "az", setLang: () => {} });

export function useTranslations(): Translations {
  return useContext(I18nContext);
}

export function useLang() {
  return useContext(LangContext);
}
