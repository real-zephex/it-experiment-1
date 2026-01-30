"use client";

import { Spinner } from "@/components/ui/spinner";

const Loading = () => {
  return (
    <div className="h-dvh w-dvw flex flex-row items-center justify-center gap-2">
      <Spinner />
      <p>Loading</p>
    </div>
  );
};

export default Loading;
