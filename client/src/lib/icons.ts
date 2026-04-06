/**
 * FairRoom icon convention
 * ─────────────────────────────────────────────
 * Library : lucide-react
 * Import  : always from "@/lib/icons", not directly from "lucide-react"
 *           (keeps the project import consistent and makes future swaps easy)
 *
 * Sizing defaults:
 *   size        = 16   inline / label icons
 *   size        = 18   button / action icons
 *   size        = 20   standalone / emphasis icons
 *   strokeWidth = 1.5  (lucide default is 2; 1.5 matches the UI's lighter weight)
 *
 * Usage:
 *   import { Bell, MapPin, iconProps } from "@/lib/icons"
 *   <Bell {...iconProps} />                // 16px, stroke 1.5
 *   <Bell {...iconProps} size={20} />      // override size only
 *
 * Accessibility:
 *   decorative  → aria-hidden="true"  (most cases)
 *   meaningful  → aria-label="..." on the parent button, or role="img" + aria-label on the icon
 */

// Default props — spread onto any icon for on-brand sizing
export const iconProps = { size: 16, strokeWidth: 1.5 } as const
export const iconPropsAction = { size: 18, strokeWidth: 1.5 } as const
export const iconPropsLg = { size: 20, strokeWidth: 1.5 } as const

// ── Navigation ────────────────────────────────
export { ArrowLeft, ArrowRight, ChevronRight, ChevronLeft, ChevronDown, Menu, LayoutDashboard } from 'lucide-react'

// ── Actions ───────────────────────────────────
export { Plus, Search, Download, Settings, RefreshCw, X } from 'lucide-react'

// ── Booking & rooms ───────────────────────────
export { Calendar, Clock, MapPin, Building2, DoorOpen } from 'lucide-react'

// ── User & account ────────────────────────────
export { User, Users, LogOut } from 'lucide-react'

// ── Status & feedback ─────────────────────────
export { Bell, CheckCircle, XCircle, AlertTriangle, Info, ShieldAlert } from 'lucide-react'

// ── Analytics ─────────────────────────────────
export { BarChart2, TrendingUp } from 'lucide-react'
