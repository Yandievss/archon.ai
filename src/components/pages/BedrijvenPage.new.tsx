'use client'

import { useState, useEffect } from 'react'
import {
  Building2,
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  MapPin,
  Users,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'
import AddCompanyModal from '@/components/modals/AddCompanyModal'

// Types (matching Prisma schema)
interface Company {
  id: string
  name: string
  sector: string | null
  location: string | null
  website: string | null
  phone: string | null
  email: string | null
  description: string | null
  status: string
  createdAt: string
  updatedAt: string
  _count?: {
    contacts: number
    deals: number
    projects: number
  }
}

// Status Badge Component
