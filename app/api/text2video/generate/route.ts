import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { script, avatarUrl } = await request.json();
  const apiKey = process.env.DID_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'D-ID API key not configured' }, { status: 500 });
  }

  if (!script) {
    return NextResponse.json({ error: 'Script is required' }, { status: 400 });
  }

  try {
    // 1. Create a new talk
    const createTalkResponse = await fetch('https://api.d-id.com/talks', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source_url: avatarUrl || "https://create-images-results.d-id.com/DefaultPresenters/Folke_f/image.jpeg", // A default avatar
        script: {
          type: 'text',
          input: script,
        },
        config: {
          result_format: 'mp4'
        }
      }),
    });

    if (!createTalkResponse.ok) {
      const errorData = await createTalkResponse.json();
      console.error('D-ID API Error (Create Talk):', errorData);
      return NextResponse.json({ error: 'Failed to create video talk', details: errorData }, { status: createTalkResponse.status });
    }

    const talkData = await createTalkResponse.json();
    const talkId = talkData.id;

    // 2. Poll for the result
    let videoResult = null;
    for (let i = 0; i < 30; i++) { // Poll for 30 seconds max
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second

      const getTalkResponse = await fetch(`https://api.d-id.com/talks/${talkId}`, {
        headers: { 'Authorization': `Basic ${apiKey}` },
      });

      const resultData = await getTalkResponse.json();

      if (resultData.status === 'done') {
        videoResult = resultData;
        break;
      } else if (resultData.status === 'error') {
        throw new Error(resultData.error || 'Video generation failed');
      }
    }

    if (!videoResult || !videoResult.result_url) {
      return NextResponse.json({ error: 'Video generation timed out or failed' }, { status: 500 });
    }

    return NextResponse.json({ videoUrl: videoResult.result_url });

  } catch (error: any) {
    console.error('Error in text2video generation:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}