import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

// Validation schema
const CompanySchema = z.object({
  name: z.string().min(1, 'Naam is verplicht'),
  sector: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  description: z.string().optional(),
  status: z.enum(['Actief', 'Inactief', 'Nieuw']).default('Actief'),
})

// GET /api/companies - Haal alle bedrijven op
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const sector = searchParams.get('sector')
    const search = searchParams.get('search')

    const where: any = {}
    
    if (status) where.status = status
    if (sector) where.sector = sector
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    const companies = await prisma.company.findMany({
      where,
      include: {
        _count: {
          select: {
            contacts: true,
            deals: true,
            projects: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(companies)
  } catch (error) {
    console.error('Error fetching companies:', error)
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    )
  }
}

// POST /api/companies - Maak een nieuw bedrijf
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = CompanySchema.parse(body)

    const company = await prisma.company.create({
      data: validatedData,
    })

    return NextResponse.json(company, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }
    
    console.error('Error creating company:', error)
    return NextResponse.json(
      { error: 'Failed to create company' },
      { status: 500 }
    )
  }
}
