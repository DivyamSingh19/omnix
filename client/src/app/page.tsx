import React from "react";

const page = () => {
  return (
    <div>
      <div className="fixed inset-0 z-0 bg-darkBlue overflow-hidden">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-[400px] w-[800px] spotlight-blur" />
      </div>
    </div>
  );
};

export default page;
