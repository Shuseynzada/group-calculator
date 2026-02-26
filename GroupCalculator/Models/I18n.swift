import Foundation

// MARK: - Language

enum Lang: String, Codable, CaseIterable {
    case az
    case en
}

// MARK: - Translation Strings

struct Translations {
    // General
    let appName: String
    let appTagline: String
    let loading: String
    let goHome: String
    let backToHome: String
    let notFound: String
    let groupNotFound: String
    let settings: String
    let language: String
    let currency: String
    let save: String
    let cancel: String
    let edit: String
    let delete: String
    let confirm: String
    let deleteConfirm: String

    // Home page
    let createNewGroup: String
    let yourGroups: String
    let howItWorks: String
    let step1Title: String
    let step1Desc: String
    let step2Title: String
    let step2Desc: String
    let step3Title: String
    let step3Desc: String

    // Groups
    let createGroup: String
    let groupNameLabel: String
    let groupNamePlaceholder: String
    let groupNameRequired: String
    let startGroupDesc: String
    let failedCreateGroup: String
    let deleteGroupConfirm: String
    let editGroupName: String

    // Members
    let members: String
    let addMember: String
    let memberName: String
    let memberNamePlaceholder: String
    let memberNameRequired: String
    let noMembers: String
    let failedAddMember: String
    let deleteMemberConfirm: String
    let memberHasExpenses: String

    // Expenses
    let expenses: String
    let addExpense: String
    let expenseTitle: String
    let expenseTitlePlaceholder: String
    let amount: String
    let paidBy: String
    let selectPayer: String
    let splitBetween: String
    let all: String
    let none: String
    let selectParticipant: String
    let noExpenses: String
    let failedAddExpense: String
    let deleteExpenseConfirm: String
    let splitBetweenLabel: String
    let perPerson: String

    // Balances
    let balances: String
    let member: String
    let paid: String
    let owed: String
    let net: String
    let noBalances: String

    // Settlements
    let settlement: String
    let optimalSettlements: String
    let allSettled: String
    let noPaymentsNeeded: String
    let settlementFooter: String

    // Date
    let expenseDate: String

    // Base currency
    let baseCurrency: String
    let baseCurrencyDesc: String
    let exchangeRates: String
    let exchangeRatesDesc: String
    let ratePerUnit: String
    let resetDefaults: String

    // Misc
    let addAtLeastOneMember: String
    let nMembersNExpenses: (Int, Int) -> String
}

// MARK: - Azerbaijani (default)

let azTranslations = Translations(
    appName: "Qrup Kalkulyator",
    appTagline: "Dostlarla x\u{0259}rcl\u{0259}ri b\u{00F6}l\u{00FC}n",
    loading: "Y\u{00FC}kl\u{0259}nir...",
    goHome: "Ana S\u{0259}hif\u{0259}",
    backToHome: "\u{2190} Ana S\u{0259}hif\u{0259}y\u{0259}",
    notFound: "404",
    groupNotFound: "Qrup tap\u{0131}lmad\u{0131}.",
    settings: "Parametrl\u{0259}r",
    language: "Dil",
    currency: "Valyuta",
    save: "Yadda saxla",
    cancel: "L\u{0259}\u{011F}v et",
    edit: "Redakt\u{0259}",
    delete: "Sil",
    confirm: "T\u{0259}sdiq et",
    deleteConfirm: "Silm\u{0259}k ist\u{0259}diyiniz\u{0259} \u{0259}minsiniz?",

    createNewGroup: "Yeni Qrup Yarat",
    yourGroups: "Qruplar\u{0131}n\u{0131}z",
    howItWorks: "Nec\u{0259} \u{0130}\u{015F}l\u{0259}yir",
    step1Title: "Qrup Yarat",
    step1Desc: "S\u{0259}f\u{0259}r v\u{0259} ya t\u{0259}dbiriniz\u{0259} ad verin",
    step2Title: "X\u{0259}rcl\u{0259}r \u{018E}lav\u{0259} Et",
    step2Desc: "Kimin n\u{0259} \u{00F6}d\u{0259}diyini izl\u{0259}yin",
    step3Title: "Hesabla\u{015F}\u{0131}n",
    step3Desc: "Kimin kim\u{0259} borclu oldu\u{011F}unu g\u{00F6}r\u{00FC}n",

    createGroup: "Qrup Yarat",
    groupNameLabel: "Qrup Ad\u{0131}",
    groupNamePlaceholder: "m\u{0259}s. Yay S\u{0259}f\u{0259}ri 2026",
    groupNameRequired: "Qrup ad\u{0131} t\u{0259}l\u{0259}b olunur",
    startGroupDesc: "Dostlarla x\u{0259}rcl\u{0259}rini b\u{00F6}lm\u{0259}k \u{00FC}\u{00E7}\u{00FC}n qrup yarad\u{0131}n.",
    failedCreateGroup: "Qrup yarad\u{0131}lmad\u{0131}.",
    deleteGroupConfirm: "Bu qrupu silm\u{0259}k ist\u{0259}yirsiniz? B\u{00FC}t\u{00FC}n \u{00FC}zvl\u{0259}r v\u{0259} x\u{0259}rcl\u{0259}r silin\u{0259}c\u{0259}k.",
    editGroupName: "Qrup ad\u{0131}n\u{0131} redakt\u{0259} edin",

    members: "\u{00DC}zvl\u{0259}r",
    addMember: "\u{00DC}zv \u{018E}lav\u{0259} Et",
    memberName: "\u{00DC}zv Ad\u{0131}",
    memberNamePlaceholder: "Ad\u{0131}n\u{0131} daxil edin",
    memberNameRequired: "\u{00DC}zv ad\u{0131} t\u{0259}l\u{0259}b olunur",
    noMembers: "H\u{0259}l\u{0259} \u{00FC}zv yoxdur. Yuxar\u{0131}dan \u{0259}lav\u{0259} edin!",
    failedAddMember: "\u{00DC}zv \u{0259}lav\u{0259} edilm\u{0259}di.",
    deleteMemberConfirm: "Bu \u{00FC}zv\u{00FC} silm\u{0259}k ist\u{0259}yirsiniz?",
    memberHasExpenses: "Bu \u{00FC}zv\u{00FC}n x\u{0259}rcl\u{0259}ri var, \u{0259}vv\u{0259}lc\u{0259} onlar\u{0131} silin.",

    expenses: "X\u{0259}rcl\u{0259}r",
    addExpense: "X\u{0259}rc \u{018E}lav\u{0259} Et",
    expenseTitle: "Ba\u{015F}l\u{0131}q",
    expenseTitlePlaceholder: "m\u{0259}s. Mario\u{2019}s-da \u{015F}am yem\u{0259}yi",
    amount: "M\u{0259}bl\u{0259}\u{011F}",
    paidBy: "\u{00D6}d\u{0259}y\u{0259}n",
    selectPayer: "\u{00D6}d\u{0259}y\u{0259}ni se\u{00E7}in...",
    splitBetween: "Aras\u{0131}nda B\u{00F6}l\u{00FC}n",
    all: "Ham\u{0131}s\u{0131}",
    none: "He\u{00E7} biri",
    selectParticipant: "\u{018E}n az\u{0131} bir i\u{015F}tirak\u{00E7}\u{0131} se\u{00E7}in",
    noExpenses: "H\u{0259}l\u{0259} x\u{0259}rc yoxdur. Yuxar\u{0131}dan \u{0259}lav\u{0259} edin!",
    failedAddExpense: "X\u{0259}rc \u{0259}lav\u{0259} edilm\u{0259}di.",
    deleteExpenseConfirm: "Bu x\u{0259}rci silm\u{0259}k ist\u{0259}yirsiniz?",
    splitBetweenLabel: "B\u{00F6}l\u{00FC}n\u{00FC}r:",
    perPerson: "/n\u{0259}f\u{0259}r",

    balances: "Balanslar",
    member: "\u{00DC}zv",
    paid: "\u{00D6}d\u{0259}yib",
    owed: "Borclu",
    net: "N\u{0259}tic\u{0259}",
    noBalances: "H\u{0259}l\u{0259} balans yoxdur.",

    settlement: "Hesabla\u{015F}ma",
    optimalSettlements: "Optimal Hesabla\u{015F}malar",
    allSettled: "Ham\u{0131}s\u{0131} hesabla\u{015F}d\u{0131}!",
    noPaymentsNeeded: "\u{00D6}d\u{0259}ni\u{015F} t\u{0259}l\u{0259}b olunmur.",
    settlementFooter: "Borclar\u{0131} hesabla\u{015F}d\u{0131}rmaq \u{00FC}\u{00E7}\u{00FC}n minimum \u{0259}m\u{0259}liyyatlar.",

    expenseDate: "Tarix",

    baseCurrency: "Hesablama valyutas\u{0131}",
    baseCurrencyDesc: "B\u{00FC}t\u{00FC}n x\u{0259}rcl\u{0259}r bu valyutaya \u{00E7}evrilir",
    exchangeRates: "Valyuta m\u{0259}z\u{0259}nn\u{0259}l\u{0259}ri",
    exchangeRatesDesc: "1 vahid = ne\u{00E7}\u{0259} AZN",
    ratePerUnit: "m\u{0259}z\u{0259}nn\u{0259}",
    resetDefaults: "S\u{0131}f\u{0131}rla",

    addAtLeastOneMember: "X\u{0259}rc \u{0259}lav\u{0259} etm\u{0259}d\u{0259}n \u{0259}vv\u{0259}l \u{0259}n az\u{0131} bir \u{00FC}zv \u{0259}lav\u{0259} edin.",
    nMembersNExpenses: { m, e in
        "\(m) \u{00FC}zv \u{00B7} \(e) x\u{0259}rc"
    }
)

// MARK: - English

let enTranslations = Translations(
    appName: "Group Calculator",
    appTagline: "Split expenses with friends",
    loading: "Loading...",
    goHome: "Go Home",
    backToHome: "\u{2190} Back to Home",
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
    expenseTitlePlaceholder: "e.g. Dinner at Mario\u{2019}s",
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
    nMembersNExpenses: { m, e in
        "\(m) member\(m != 1 ? "s" : "") \u{00B7} \(e) expense\(e != 1 ? "s" : "")"
    }
)

func getTranslations(_ lang: Lang) -> Translations {
    switch lang {
    case .az: return azTranslations
    case .en: return enTranslations
    }
}
