import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { text, avatarType } = await request.json()

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    // For demo purposes, we'll simulate video generation
    // In production, integrate with D-ID, Synthesia, or HeyGen
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Return a mock video URL
    const mockVideoUrl = avatarType === 'doctor' 
      ? '/videos/doctor-avatar-sample.mp4'
      : '/videos/patient-avatar-sample.mp4'

    return NextResponse.json({
      success: true,
      videoUrl: mockVideoUrl,
      text: text,
      avatarType: avatarType
    })

  } catch (error) {
    console.error('Text2Video API Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate video' },
      { status: 500 }
    )
  }
}