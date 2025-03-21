import { NextResponse } from 'next/server';

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

type Props = {
  params: Promise<{
    id: string
  }>
}

export async function GET(
  request: Request, 
  props: Props
) {
  const params = await props.params;
  const id = params.id;
  
  try {
    const trailerUrl = `${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`;
    const response = await fetch(trailerUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch trailer: ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching trailer:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trailer' },
      { status: 500 }
    );
  }
}