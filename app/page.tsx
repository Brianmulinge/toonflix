/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

type HomeProps = {
  id: number;
  title: string;
  backdrop_path: string;
  poster_path: string;
  overview: string;
  name: string;
  original_name: string;
  movieId: number;
};

type ApiResponse = {
  results: HomeProps[];
};

type TrailerResponseType = {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
};

type TrailerResponse = {
  results: TrailerResponseType[];
};

export default function Home() {
  const [trailerUrl, setTrailerUrl] = useState("");
  const [movies, setMovies] = useState<HomeProps[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<HomeProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // Fetch movies from our internal API route
        const response = await fetch('/api/movies');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data: ApiResponse = await response.json();
        const fetchedMovies = data.results;
        setMovies(fetchedMovies);
        
        // Set a random movie as the featured movie
        const randomMovie =
          fetchedMovies[Math.floor(Math.random() * fetchedMovies.length)];
        setSelectedMovie(randomMovie ?? null);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    void fetchData();
  }, []);

  const handleMovieSelect = (movie: HomeProps) => {
    setSelectedMovie(movie);
    // Scroll to the top to show the featured section
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  function truncate(str: string | null | undefined, n: number): string {
    if (!str || str.length <= n) {
      return str || "";
    }
    return str.slice(0, n - 1) + "...";
  }

  const handleTrailerClick = async (movieId: number | undefined) => {
    if (!movieId) return;

    try {
      const response = await fetch(`/api/movies/${movieId}/trailer`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data: TrailerResponse = await response.json();
      const trailerKey = data.results[0]?.key || "";
      
      if (trailerKey) {
        setTrailerUrl(trailerKey);
        setIsDialogOpen(true);
      } else {
        // Handle case when no trailer is available
        alert("No trailer available for this movie");
      }
    } catch (error) {
      console.error("Error fetching trailer:", error);
    }
  };
  
  // Close dialog and reset trailer
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setTimeout(() => {
      setTrailerUrl("");
    }, 500); // Small delay to allow dialog close animation
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <main className="px-6 py-6">
        {/* Navigation */}
        <nav className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="mr-8">
              <Link href="/">
                <span className="text-3xl font-bold text-white">Toonflix </span>
              </Link>
            </div>
          </div>
        </nav>

        {/* Featured Content */}
        {selectedMovie && (
          <div className="relative w-full h-[500px] md:h-[600px] rounded-2xl overflow-hidden mb-16">
            {/* Overlay gradient for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent z-10"></div>

            {/* Movie background image */}
            <div className="absolute inset-0">
              <Image
                src={`https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path}`}
                alt={selectedMovie.title || selectedMovie.name || selectedMovie.original_name}
                layout="fill"
                objectFit="cover"
                priority
                className="w-full h-full"
              />
            </div>

            <div className="relative z-20 p-10 flex flex-col h-full justify-end max-w-2xl">
              <h1 className="text-5xl font-bold mb-4">
                {selectedMovie.title || selectedMovie.name || selectedMovie.original_name}
              </h1>
              <p className="text-gray-200 mb-6">
                {truncate(selectedMovie.overview, 200)}
              </p>
              <div className="flex space-x-4">
                <button 
                  className="flex items-center bg-white text-black font-medium py-3 px-6 rounded-full hover:bg-gray-200 transition"
                  onClick={() => handleTrailerClick(selectedMovie.id)}
                >
                  <Play className="w-5 h-5 mr-2" fill="currentColor" />
                  Watch Trailer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Trailer Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogContent className="sm:max-w-[900px] bg-gray-900 border-gray-800 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl text-white">
                {selectedMovie?.title || selectedMovie?.name || selectedMovie?.original_name} - Trailer
              </DialogTitle>
            </DialogHeader>
            <div className="aspect-video w-full mt-2">
              {trailerUrl && (
                <iframe
                  className="w-full h-full rounded-md"
                  src={`https://www.youtube.com/embed/${trailerUrl}?autoplay=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Trending Movies */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Animated Movies</h2>
          <div className="w-full overflow-x-auto overflow-y-hidden" style={{ height: '280px' }}>
            <div className="flex flex-row space-x-4 h-full">
              {movies.map((movie) => (
                <div
                  key={movie.id}
                  className="cursor-pointer transition duration-300 group flex-shrink-0"
                  onClick={() => handleMovieSelect(movie)}
                >
                  <div className="rounded-lg overflow-hidden w-[160px] aspect-[2/3] bg-gray-800 relative hover:ring-2 hover:ring-blue-500 transition">
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path || movie.backdrop_path}`}
                      alt={movie.title || movie.name || movie.original_name}
                      layout="fill"
                      objectFit="cover"
                      className="w-full h-full group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <p className="text-sm mt-2 text-gray-300 group-hover:text-white truncate w-[160px]">
                    {movie.title || movie.name || movie.original_name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}