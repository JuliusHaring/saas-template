export default function TutorialVideo() {
  return (
    <div className="md:block hidden relative justify-center items-center overflow-hidden hidden md:flex">
      <video
        className="w-full h-full object-cover h-full md:w-4/5 sm:w-full"
        autoPlay
        loop
        muted
        playsInline
      >
        <source
          src="/videos/tutorial_trimmed_cut_macbook.mp4"
          type="video/mp4"
        />
        Dein Browser unterstützt dieses Video nicht.
      </video>
    </div>
  );
}
