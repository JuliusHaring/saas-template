export default function VideoAutoPlay() {
  return (
    <div className="relative flex justify-center items-center overflow-hidden">
      <div className="border border-gray-300 md:w-3/4 sm:w-1/2 h-[calc(100%-200px)]">
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/videos/tutorial_trimmed_cut.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}
