'use client';

export default function ResumeApp() {
  return (
    <div className="w-full h-full bg-[#1c1c1e] flex flex-col">
      <iframe 
        src="https://drive.google.com/file/d/1tKuMHB9zgS9vDiU3_pBoWg64XXkO3aIO/preview" 
        className="w-full h-full border-none"
        title="Resume"
        allow="autoplay"
      />
    </div>
  );
}
