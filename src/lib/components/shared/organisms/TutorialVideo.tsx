export default function VideoAutoPlay() {
    return (
      <div className="relative w-full h-[400px] overflow-hidden">
        {/* Top and Bottom Fade Effects */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white to-transparent pointer-events-none z-10"></div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent pointer-events-none z-10"></div>
        
        {/* YouTube Video Embed without controls */}
        <iframe 
          className="w-full h-full object-cover"
          src="https://www.youtube.com/embed/mSo_H-LWhwI?autoplay=1&mute=1&rel=0&loop=1&controls=0"
          title="YouTube video player" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen>
        </iframe>
      </div>
    );
  }
  