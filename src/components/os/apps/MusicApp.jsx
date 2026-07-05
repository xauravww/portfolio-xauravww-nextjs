'use client';
import { useState, useRef, useEffect } from 'react';
import YouTube from 'react-youtube';

// Icons
const PlayIcon = <svg className="w-5 h-5 ml-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>;
const PauseIcon = <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>;
const NextIcon = <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>;
const PrevIcon = <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /></svg>;
const HomeIcon = <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const SearchIcon = <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const LibraryIcon = <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>;

const SpinnerIcon = <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="3" className="opacity-25"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;

const formatTime = (time) => {
  if (isNaN(time) || time === Infinity) return '0:00';
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function MusicApp() {
  const [view, setView] = useState('home'); // default to 'home'
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [homeLoading, setHomeLoading] = useState(true);
  
  const [homeData, setHomeData] = useState({
    trending: [],
    topHits: [],
    local: []
  });

  const [playlist, setPlaylist] = useState([]);
  const [currentTrack, setCurrentTrack] = useState({ id: '', title: '', artist: '', cover: '' });
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [useIframeFallback, setUseIframeFallback] = useState(false);
  
  const playerRef = useRef(null);
  const audioRef = useRef(null);
  const progressInterval = useRef(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Try to get country to localize results without hitting limits
        let locationName = 'Global';
        try {
          const res = await fetch('https://ipapi.co/json/');
          const data = await res.json();
          if (data.country_name) locationName = data.country_name;
        } catch (e) {
          console.log("Using global default for music");
        }

        const fetchQuery = async (q) => {
          const res = await fetch(`/api/ytmusic?q=${encodeURIComponent(q)}`);
          const data = await res.json();
          return Array.isArray(data) ? data.map(t => {
            let coverUrl = t.thumbnails?.[t.thumbnails.length - 1]?.url || '';
            coverUrl = coverUrl.replace(/w\d+-h\d+/, 'w500-h500');
            return {
              id: t.videoId,
              title: t.name,
              artist: t.artist?.name || 'Unknown Artist',
              cover: coverUrl || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=500&q=80',
            };
          }).slice(0, 8) : []; // Limit to 8 items per section
        };

        const [trending, topHits, local] = await Promise.all([
          fetchQuery('Trending Pop Music 2024'),
          fetchQuery('Global Top 50 Hits'),
          fetchQuery(`Top hits ${locationName}`)
        ]);

        setHomeData({ trending, topHits, local });
        if (trending.length > 0) {
          setPlaylist(trending);
          setCurrentTrack(trending[0]);
        }
      } catch (err) {
        console.error("Home data fetch failed", err);
      }
      setHomeLoading(false);
    };

    fetchHomeData();
  }, []);

  // Poll for progress updates (only used when in iframe fallback mode)
  useEffect(() => {
    if (isPlaying && useIframeFallback) {
      progressInterval.current = setInterval(async () => {
        if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
          try {
            const currentTime = await playerRef.current.getCurrentTime();
            if (currentTime) setProgress(currentTime);
          } catch(e) {}
        }
      }, 500);
    } else {
      clearInterval(progressInterval.current);
    }
    return () => clearInterval(progressInterval.current);
  }, [isPlaying, useIframeFallback]);

  // Handle Play/Pause synchronization for Native Audio
  useEffect(() => {
    if (!useIframeFallback && audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error('Audio play blocked:', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack, useIframeFallback]);

  // Reset fallback on track change
  useEffect(() => {
    setUseIframeFallback(false);
    setAudioLoading(true);
  }, [currentTrack]);

  // Register Media Session for Lock Screen Controls
  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.artist,
        artwork: [{ src: currentTrack.cover, sizes: '500x500', type: 'image/jpeg' }]
      });

      navigator.mediaSession.setActionHandler('play', togglePlay);
      navigator.mediaSession.setActionHandler('pause', togglePlay);
      navigator.mediaSession.setActionHandler('previoustrack', playPrev);
      navigator.mediaSession.setActionHandler('nexttrack', playNext);
    }
  }, [currentTrack]);

  const togglePlay = () => {
    if (useIframeFallback && playerRef.current) {
      if (isPlaying) playerRef.current.pauseVideo();
      else playerRef.current.playVideo();
    }
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    if (playlist.length === 0) return;
    const currentIdx = playlist.findIndex(t => t.id === currentTrack.id);
    if (currentIdx !== -1) {
      const nextIdx = (currentIdx + 1) % playlist.length;
      setCurrentTrack(playlist[nextIdx]);
      setIsPlaying(true);
    }
  };

  const playPrev = () => {
    if (playlist.length === 0) return;
    const currentIdx = playlist.findIndex(t => t.id === currentTrack.id);
    if (currentIdx !== -1) {
      const prevIdx = (currentIdx - 1 + playlist.length) % playlist.length;
      setCurrentTrack(playlist[prevIdx]);
      setIsPlaying(true);
    }
  };

  const searchMusic = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/ytmusic?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      
      if (Array.isArray(data)) {
        const tracks = data.map(t => {
          let coverUrl = t.thumbnails?.[t.thumbnails.length - 1]?.url || '';
          coverUrl = coverUrl.replace(/w\d+-h\d+/, 'w500-h500');
          return {
            id: t.videoId,
            title: t.name,
            artist: t.artist?.name || 'Unknown Artist',
            cover: coverUrl || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=500&q=80',
          };
        });
        setResults(tracks);
      }
    } catch (err) {
      console.error('Search failed', err);
    }
    setLoading(false);
  };

  const selectTrack = (track, newPlaylist) => {
    setPlaylist(newPlaylist);
    if (track.id !== currentTrack.id) {
      setAudioLoading(true);
      setCurrentTrack(track);
      setProgress(0);
    }
    setIsPlaying(true);
  };

  return (
    <div className="w-full h-full bg-[#121212] text-white flex flex-col font-sans select-none overflow-hidden">
      {/* Top Main Area */}
      <div className="flex-1 flex min-h-0">
        
        {/* Sidebar */}
        <div className="w-[60px] md:w-[240px] bg-black flex-shrink-0 flex flex-col items-center md:items-start pt-6 gap-2">
          <button 
            onClick={() => setView('home')} 
            className={`w-full flex items-center gap-4 px-4 py-3 hover:text-white transition-colors ${view === 'home' ? 'text-white' : 'text-white/60'}`}
          >
            {HomeIcon} <span className="hidden md:inline font-bold">Home</span>
          </button>
          <button 
            onClick={() => setView('search')} 
            className={`w-full flex items-center gap-4 px-4 py-3 hover:text-white transition-colors ${view === 'search' ? 'text-white' : 'text-white/60'}`}
          >
            {SearchIcon} <span className="hidden md:inline font-bold">Search</span>
          </button>
          <button 
            className="w-full flex items-center gap-4 px-4 py-3 text-white/60 hover:text-white transition-colors"
          >
            {LibraryIcon} <span className="hidden md:inline font-bold">Your Library</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-gradient-to-b from-[#2a2a2a] to-[#121212] flex flex-col overflow-y-auto custom-scrollbar relative">
          
          {view === 'search' && (
            <div className="p-6">
              <form onSubmit={searchMusic} className="relative w-full max-w-[400px] mb-8">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black">{SearchIcon}</div>
                <input 
                  type="text" 
                  placeholder="What do you want to listen to?" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-white text-black font-medium rounded-full py-3 pl-12 pr-6 outline-none shadow-lg"
                />
              </form>

              {loading ? (
                <div className="flex justify-center items-center h-40">
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              ) : results.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {results.map(track => (
                    <div 
                      key={track.id} 
                      onClick={() => selectTrack(track, results)}
                      className="bg-[#181818] hover:bg-[#282828] p-4 rounded-xl cursor-pointer transition-all group"
                    >
                      <div className="relative w-full aspect-square mb-4 shadow-lg overflow-hidden rounded-md">
                        <img src={track.cover} className="w-full h-full object-cover" alt="cover" />
                        <button className="absolute bottom-2 right-2 w-12 h-12 bg-[#1ed760] text-black rounded-full flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all shadow-xl">
                          {PlayIcon}
                        </button>
                      </div>
                      <div className="font-bold text-white text-[15px] truncate mb-1">{track.title}</div>
                      <div className="font-medium text-white/60 text-[13px] truncate">{track.artist}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-white/40">Search for an artist, song, or podcast.</div>
              )}
            </div>
          )}

          {view === 'home' && (
            <div className="p-6">
              {homeLoading ? (
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1ed760]"></div>
                  <div className="text-white/50 font-medium tracking-wider text-sm">LOADING BEST TRACKS...</div>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold mb-6">Trending Near You</h1>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                    {homeData.local.map(track => (
                      <div 
                        key={track.id} 
                        onClick={() => selectTrack(track, homeData.local)}
                        className="bg-[#181818] hover:bg-[#282828] p-4 rounded-xl cursor-pointer transition-all group"
                      >
                        <div className="relative w-full aspect-square mb-4 shadow-lg overflow-hidden rounded-md">
                          <img src={track.cover} className="w-full h-full object-cover" alt="cover" />
                          <button className="absolute bottom-2 right-2 w-12 h-12 bg-[#1ed760] text-black rounded-full flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all shadow-xl">
                            {PlayIcon}
                          </button>
                        </div>
                        <div className="font-bold text-white text-[15px] truncate mb-1">{track.title}</div>
                        <div className="font-medium text-white/60 text-[13px] truncate">{track.artist}</div>
                      </div>
                    ))}
                  </div>

                  <h2 className="text-2xl font-bold mb-6 hover:underline cursor-pointer inline-block">Global Top Hits</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                    {homeData.topHits.map(track => (
                      <div 
                        key={track.id} 
                        onClick={() => selectTrack(track, homeData.topHits)}
                        className="bg-[#181818] hover:bg-[#282828] p-4 rounded-xl cursor-pointer transition-all group"
                      >
                        <div className="relative w-full aspect-square mb-4 shadow-lg overflow-hidden rounded-md">
                          <img src={track.cover} className="w-full h-full object-cover" alt="cover" />
                          <button className="absolute bottom-2 right-2 w-12 h-12 bg-[#1ed760] text-black rounded-full flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all shadow-xl">
                            {PlayIcon}
                          </button>
                        </div>
                        <div className="font-bold text-white text-[15px] truncate mb-1">{track.title}</div>
                        <div className="font-medium text-white/60 text-[13px] truncate">{track.artist}</div>
                      </div>
                    ))}
                  </div>

                  <h2 className="text-2xl font-bold mb-6 hover:underline cursor-pointer inline-block">Trending Pop Music</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                    {homeData.trending.map(track => (
                      <div 
                        key={track.id} 
                        onClick={() => selectTrack(track, homeData.trending)}
                        className="bg-[#181818] hover:bg-[#282828] p-4 rounded-xl cursor-pointer transition-all group"
                      >
                        <div className="relative w-full aspect-square mb-4 shadow-lg overflow-hidden rounded-md">
                          <img src={track.cover} className="w-full h-full object-cover" alt="cover" />
                          <button className="absolute bottom-2 right-2 w-12 h-12 bg-[#1ed760] text-black rounded-full flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all shadow-xl">
                            {PlayIcon}
                          </button>
                        </div>
                        <div className="font-bold text-white text-[15px] truncate mb-1">{track.title}</div>
                        <div className="font-medium text-white/60 text-[13px] truncate">{track.artist}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Player Bar */}
      <div className="h-[90px] bg-[#181818] border-t border-white/10 flex items-center justify-between px-4 z-50">
        
        {/* Now Playing Info */}
        <div className="flex items-center gap-4 w-[30%] min-w-[120px]">
          <img src={currentTrack.cover} className="w-14 h-14 rounded-md shadow-sm object-cover hidden sm:block" alt="cover" />
          <div className="flex flex-col min-w-0">
            <div className="font-medium text-[14px] text-white hover:underline cursor-pointer truncate">{currentTrack.title}</div>
            <div className="text-[12px] text-white/60 hover:underline cursor-pointer truncate">{currentTrack.artist}</div>
          </div>
        </div>

        {/* Controls & Scrubber */}
        <div className="flex-1 max-w-[700px] flex flex-col items-center justify-center px-4">
          <div className="flex items-center gap-6 mb-2">
            <button onClick={playPrev} className="text-white/60 hover:text-white transition-colors">{PrevIcon}</button>
            <button 
              onClick={togglePlay} 
              disabled={audioLoading}
              className={`w-8 h-8 flex items-center justify-center bg-white text-black rounded-full transition-transform ${audioLoading ? 'opacity-50' : 'hover:scale-105'}`}
            >
              {audioLoading ? SpinnerIcon : (isPlaying ? PauseIcon : PlayIcon)}
            </button>
            <button onClick={playNext} className="text-white/60 hover:text-white transition-colors">{NextIcon}</button>
          </div>
          
          <div className="w-full flex items-center gap-2">
            <span className="text-[11px] text-white/60 w-8 text-right">{formatTime(progress)}</span>
            <input 
              type="range" 
              min="0" 
              max={duration || 100} 
              value={progress}
              onChange={(e) => {
                const newTime = Number(e.target.value);
                if (useIframeFallback) {
                  if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
                    playerRef.current.seekTo(newTime, true);
                  }
                } else if (audioRef.current) {
                  audioRef.current.currentTime = newTime;
                }
                setProgress(newTime);
              }}
              className="flex-1 h-1 bg-white/20 rounded-full appearance-none outline-none hover:[&::-webkit-slider-thumb]:bg-[#1ed760] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
              style={{ background: `linear-gradient(to right, white ${(progress / (duration || 1)) * 100}%, rgba(255,255,255,0.2) ${(progress / (duration || 1)) * 100}%)` }}
            />
            <span className="text-[11px] text-white/60 w-8">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="w-[30%] min-w-[120px] flex justify-end">
           {/* Placeholder for volume etc */}
        </div>
      </div>

      {/* Native Audio Engine (Supports Screen-Off & Background Playback) */}
      {!useIframeFallback && (
        <audio 
          ref={audioRef} 
          src={`/api/stream?id=${currentTrack.id}`} 
          onPlaying={() => setAudioLoading(false)}
          onCanPlay={() => setAudioLoading(false)}
          onTimeUpdate={() => setProgress(audioRef.current?.currentTime || 0)}
          onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
          onEnded={playNext}
          onError={(e) => {
            console.warn("Native audio failed, falling back to YouTube iframe.");
            setUseIframeFallback(true);
          }}
        />
      )}

      {/* YouTube Iframe Fallback (Used only when ytdl stream fails) */}
      {useIframeFallback && (
        <div className="absolute opacity-0 pointer-events-none -z-50 top-[-9999px]">
          <YouTube 
            videoId={currentTrack.id} 
            opts={{ height: '0', width: '0', playerVars: { autoplay: isPlaying ? 1 : 0, controls: 0, disablekb: 1 } }} 
            onReady={(e) => { 
              playerRef.current = e.target; 
              if (isPlaying) playerRef.current.playVideo(); 
            }} 
            onStateChange={(e) => {
              if (e.data === 1) { // Playing
                setIsPlaying(true);
                setAudioLoading(false);
                setDuration(e.target.getDuration());
              } else if (e.data === 2) { // Paused
                setIsPlaying(false);
              } else if (e.data === 0) { // Ended
                playNext();
              } else if (e.data === 3) { // Buffering
                setAudioLoading(true);
              }
            }}
            onError={() => {
              setAudioLoading(false);
              setIsPlaying(false);
              playNext(); // Skip totally broken tracks automatically
            }}
          />
        </div>
      )}
    </div>
  );
}
