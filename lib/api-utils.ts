import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export function successResponse<T>(data: T, message?: string, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    } as ApiResponse<T>,
    { status }
  )
}

export function errorResponse(error: string | Error, status = 400) {
  const errorMessage = error instanceof Error ? error.message : error
  console.error('[API Error]', errorMessage)
  return NextResponse.json(
    {
      success: false,
      error: errorMessage,
    } as ApiResponse,
    { status }
  )
}

export function validationErrorResponse(error: ZodError | any) {
  const issues = error instanceof ZodError 
    ? error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join(', ')
    : 'Validation failed'
  
  return NextResponse.json(
    {
      success: false,
      error: issues,
    } as ApiResponse,
    { status: 400 }
  )
}

export function unauthorizedResponse() {
  return NextResponse.json(
    {
      success: false,
      error: 'Unauthorized',
    } as ApiResponse,
    { status: 401 }
  )
}

export function notFoundResponse(resource: string) {
  return NextResponse.json(
    {
      success: false,
      error: `${resource} not found`,
    } as ApiResponse,
    { status: 404 }
  )
}

export function serverErrorResponse(error: Error | string = 'Internal server error') {
  const message = error instanceof Error ? error.message : error
  console.error('[Server Error]', message)
  return NextResponse.json(
    {
      success: false,
      error: 'Internal server error',
    } as ApiResponse,
    { status: 500 }
  )
}
