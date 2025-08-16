"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

interface BreadcrumbItem {
  label: string
  href: string
  isActive?: boolean
}

export default function BreadcrumbNavigation() {
  const pathname = usePathname()
  const { t } = useLanguage()

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = pathname.split("/").filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = [{ label: t("nav.dashboard"), href: "/" }]

    let currentPath = ""
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === pathSegments.length - 1

      let label = segment.charAt(0).toUpperCase() + segment.slice(1)

      // Map specific routes to translated labels
      const routeMap: Record<string, string> = {
        employees: t("nav.employees"),
        recruitment: t("nav.recruitment"),
        attendance: t("nav.attendance"),
        leave: t("nav.leave"),
        payroll: t("nav.payroll"),
        evaluation: t("nav.evaluation"),
        assets: t("nav.assets"),
        notifications: t("nav.notifications"),
        profile: t("nav.profile"),
        admin: "Admin",
        organization: "Organization",
        add: "Add New",
        edit: "Edit",
        view: "View Details",
      }

      if (routeMap[segment]) {
        label = routeMap[segment]
      }

      breadcrumbs.push({
        label,
        href: currentPath,
        isActive: isLast,
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  if (breadcrumbs.length <= 1) return null

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      {breadcrumbs.map((item, index) => (
        <div key={item.href} className="flex items-center space-x-2">
          {index === 0 && <Home className="w-4 h-4" />}
          {item.isActive ? (
            <span className="font-medium text-gray-900">{item.label}</span>
          ) : (
            <Link href={item.href} className="hover:text-blue-600 transition-colors duration-200">
              {item.label}
            </Link>
          )}
          {index < breadcrumbs.length - 1 && <ChevronRight className="w-4 h-4 text-gray-400" />}
        </div>
      ))}
    </nav>
  )
}
