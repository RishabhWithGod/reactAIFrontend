import type { ReactNode } from "react";
import bgImage from "@/assets/bg.jpeg";

type Props = {
  children: ReactNode;
};

export default function AppBackground({ children }: Props) {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundAttachment: "fixed",
      }}
    >
      <div className="min-h-screen bg-[#020817]/40 backdrop-blur-[1px]">
        {children}
      </div>
    </div>
  );
}              