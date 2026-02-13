import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

type RouteContext = {
  params: Promise<{ id: string }>
}

const CompanyUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  sector: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  description: z.string().optional(),
  status: z.enum(['Actief', 'Inactief', 'Nieuw']).optional(),
})

// GET /api/companies/[id]
export async function GET(
  _request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        contacts: true,
        deals: true,
        projects: true,
        quotes: true,
      },
    })

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(company)
  } catch (error) {
    console.error('Error fetching company:', error)
    return NextResponse.json(
      { error: 'Failed to fetch company' },
      { status: 500 }
    )
  }
}

// PUT /api/companies/[id]
export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const validatedData = CompanyUpdateSchema.parse(body)

    const company = await prisma.company.update({
      where: { id },
      data: validatedData,
    })

    return NextResponse.json(company)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }
    
    console.error('Error updating company:', error)
    return NextResponse.json(
      { error: 'Failed to update company' },
      { status: 500 }
    )
  }
}

// DELETE /api/companies/[id]
export async function DELETE(
  _request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    await prisma.company.delete({
      where: { id },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error deleting company:', error)
    return NextResponse.json(
      { error: 'Failed to delete company' },
      { status: 500 }
    )
  }
}
