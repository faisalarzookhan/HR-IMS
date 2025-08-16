"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "ar"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.employees": "Employees",
    "nav.recruitment": "Recruitment",
    "nav.attendance": "Attendance",
    "nav.leave": "Leave",
    "nav.payroll": "Payroll",
    "nav.evaluation": "Evaluation",
    "nav.assets": "IT Assets",
    "nav.profile": "Profile",
    "nav.settings": "Settings",
    "nav.notifications": "Notifications",

    // Common
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.add": "Add",
    "common.view": "View",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.status": "Status",
    "common.actions": "Actions",
    "common.loading": "Loading...",
    "common.submit": "Submit",
    "common.approve": "Approve",
    "common.reject": "Reject",
    "common.pending": "Pending",
    "common.approved": "Approved",
    "common.rejected": "Rejected",

    // Dashboard
    "dashboard.title": "HR Dashboard",
    "dashboard.welcome": "Welcome back",
    "dashboard.totalEmployees": "Total Employees",
    "dashboard.activeRecruitment": "Active Recruitment",
    "dashboard.pendingLeaves": "Pending Leaves",
    "dashboard.monthlyPayroll": "Monthly Payroll",

    // Recruitment
    "recruitment.title": "Recruitment Management",
    "recruitment.addPosition": "Add New Position",
    "recruitment.positions": "Open Positions",
    "recruitment.candidates": "Candidates",
    "recruitment.interviews": "Interviews",
    "recruitment.onboarding": "Onboarding",
    "recruitment.position": "Position",
    "recruitment.department": "Department",
    "recruitment.location": "Location",
    "recruitment.country": "Country",
    "recruitment.salary": "Salary",
    "recruitment.contract": "Contract Period",
    "recruitment.joiningDate": "Joining Date",
    "recruitment.rounds": "Interview Rounds",
    "recruitment.round1": "HR Screening",
    "recruitment.round2": "Technical Interview",
    "recruitment.round3": "Manager Interview",
    "recruitment.round4": "Final Interview",
    "recruitment.selected": "Selected",
    "recruitment.rejected": "Rejected",
    "recruitment.inProgress": "In Progress",

    // Employee
    "employee.personalInfo": "Personal Information",
    "employee.name": "Full Name",
    "employee.email": "Email Address",
    "employee.phone": "Phone Number",
    "employee.empCode": "Employee Code",
    "employee.designation": "Designation",
    "employee.department": "Department",
    "employee.joiningDate": "Joining Date",
    "employee.salary": "Salary",
    "employee.contractPeriod": "Contract Period",
    "employee.location": "Location",
    "employee.country": "Country",

    // Leave
    "leave.application": "Leave Application",
    "leave.vacation": "Vacation Request",
    "leave.type": "Leave Type",
    "leave.startDate": "Start Date",
    "leave.endDate": "End Date",
    "leave.reason": "Reason",
    "leave.balance": "Leave Balance",
    "leave.annual": "Annual Leave",
    "leave.sick": "Sick Leave",
    "leave.emergency": "Emergency Leave",

    // Payroll
    "payroll.management": "Payroll Management",
    "payroll.statement": "Salary Statement",
    "payroll.basic": "Basic Salary",
    "payroll.allowances": "Allowances",
    "payroll.deductions": "Deductions",
    "payroll.gross": "Gross Salary",
    "payroll.net": "Net Salary",
    "payroll.gratuity": "Gratuity",
    "payroll.endOfService": "End of Service",
  },
  ar: {
    // Navigation
    "nav.dashboard": "لوحة التحكم",
    "nav.employees": "الموظفون",
    "nav.recruitment": "التوظيف",
    "nav.attendance": "الحضور",
    "nav.leave": "الإجازات",
    "nav.payroll": "الرواتب",
    "nav.evaluation": "التقييم",
    "nav.assets": "الأصول التقنية",
    "nav.profile": "الملف الشخصي",
    "nav.settings": "الإعدادات",
    "nav.notifications": "الإشعارات",

    // Common
    "common.save": "حفظ",
    "common.cancel": "إلغاء",
    "common.edit": "تعديل",
    "common.delete": "حذف",
    "common.add": "إضافة",
    "common.view": "عرض",
    "common.search": "بحث",
    "common.filter": "تصفية",
    "common.status": "الحالة",
    "common.actions": "الإجراءات",
    "common.loading": "جاري التحميل...",
    "common.submit": "إرسال",
    "common.approve": "موافقة",
    "common.reject": "رفض",
    "common.pending": "قيد الانتظار",
    "common.approved": "موافق عليه",
    "common.rejected": "مرفوض",

    // Dashboard
    "dashboard.title": "لوحة تحكم الموارد البشرية",
    "dashboard.welcome": "مرحباً بعودتك",
    "dashboard.totalEmployees": "إجمالي الموظفين",
    "dashboard.activeRecruitment": "التوظيف النشط",
    "dashboard.pendingLeaves": "الإجازات المعلقة",
    "dashboard.monthlyPayroll": "الراتب الشهري",

    // Recruitment
    "recruitment.title": "إدارة التوظيف",
    "recruitment.addPosition": "إضافة منصب جديد",
    "recruitment.positions": "المناصب المفتوحة",
    "recruitment.candidates": "المرشحون",
    "recruitment.interviews": "المقابلات",
    "recruitment.onboarding": "التأهيل",
    "recruitment.position": "المنصب",
    "recruitment.department": "القسم",
    "recruitment.location": "الموقع",
    "recruitment.country": "البلد",
    "recruitment.salary": "الراتب",
    "recruitment.contract": "فترة العقد",
    "recruitment.joiningDate": "تاريخ الالتحاق",
    "recruitment.rounds": "جولات المقابلة",
    "recruitment.round1": "فحص الموارد البشرية",
    "recruitment.round2": "مقابلة تقنية",
    "recruitment.round3": "مقابلة المدير",
    "recruitment.round4": "المقابلة النهائية",
    "recruitment.selected": "مختار",
    "recruitment.rejected": "مرفوض",
    "recruitment.inProgress": "قيد التنفيذ",

    // Employee
    "employee.personalInfo": "المعلومات الشخصية",
    "employee.name": "الاسم الكامل",
    "employee.email": "عنوان البريد الإلكتروني",
    "employee.phone": "رقم الهاتف",
    "employee.empCode": "رمز الموظف",
    "employee.designation": "المسمى الوظيفي",
    "employee.department": "القسم",
    "employee.joiningDate": "تاريخ الالتحاق",
    "employee.salary": "الراتب",
    "employee.contractPeriod": "فترة العقد",
    "employee.location": "الموقع",
    "employee.country": "البلد",

    // Leave
    "leave.application": "طلب إجازة",
    "leave.vacation": "طلب عطلة",
    "leave.type": "نوع الإجازة",
    "leave.startDate": "تاريخ البداية",
    "leave.endDate": "تاريخ النهاية",
    "leave.reason": "السبب",
    "leave.balance": "رصيد الإجازة",
    "leave.annual": "إجازة سنوية",
    "leave.sick": "إجازة مرضية",
    "leave.emergency": "إجازة طارئة",

    // Payroll
    "payroll.management": "إدارة الرواتب",
    "payroll.statement": "كشف الراتب",
    "payroll.basic": "الراتب الأساسي",
    "payroll.allowances": "البدلات",
    "payroll.deductions": "الخصومات",
    "payroll.gross": "إجمالي الراتب",
    "payroll.net": "صافي الراتب",
    "payroll.gratuity": "المكافأة",
    "payroll.endOfService": "نهاية الخدمة",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language
    if (savedLang && (savedLang === "en" || savedLang === "ar")) {
      setLanguage(savedLang)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = lang
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)["en"]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
