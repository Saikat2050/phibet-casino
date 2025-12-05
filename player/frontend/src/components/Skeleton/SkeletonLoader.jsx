import React from "react";

export const SkeletonLoader = () => (
    <div className="modal-main-container px-3 py-7 w-full mx-auto mt-10   rounded-lg relative">
        <div className="animate-pulse">
            <div className="h-6  00 rounded mb-4"></div>
            <div className="grid grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                    <React.Fragment key={i}>
                        <div key={i} className="h-12  00 rounded"></div>
                        <div key={i} className="h-12  00 rounded"></div>
                        <div key={i} className="h-12  00 rounded"></div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    </div>
);