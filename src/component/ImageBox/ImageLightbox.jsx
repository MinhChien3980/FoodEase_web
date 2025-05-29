import React, { useState } from "react";
import dynamic from "next/dynamic";
import { createRoot } from "react-dom/client";
import Download from "yet-another-react-lightbox/plugins/download";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Share from "yet-another-react-lightbox/plugins/share";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

// Importing Lightbox dynamically, without SSR
const Lightbox = dynamic(() => import("yet-another-react-lightbox"), {
  ssr: false,
});

// Importing Lightbox styles
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

// Function to open the lightbox for multiple images
export const openLightbox = (images, startIndex = 0, thumbnails = false) => {
  let modules = thumbnails
    ? [Download, Captions, Thumbnails, Share, Zoom]
    : [Download, Captions, Share, Zoom];
  const LightboxComponent = () => {
    const [open, setOpen] = useState(true);
    const thumbnailsRef = React.useRef(null);

    if (!open) {
      // Remove the root div when the lightbox is closed
      setTimeout(() => {
        const rootDiv = document.getElementById("lightbox-root");
        if (rootDiv) {
          document.body.removeChild(rootDiv);
        }
      }, 0);
      return null;
    }

    return (
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={images}
        index={startIndex}
        carousel={{ finite: true, preload: 2 }}
        plugins={modules}
        thumbnails={{ ref: thumbnailsRef }}
        on={{
          click: () => {
            (thumbnailsRef.current?.visible
              ? thumbnailsRef.current?.hide
              : thumbnailsRef.current?.show)?.();
          },
        }}
        render={{
          // Custom caption to show title
          caption: ({ currentSlide }) => (
            <div className="p-4 text-center text-white">
              {currentSlide.title && (
                <h3 className="text-lg font-semibold">{currentSlide.title}</h3>
              )}
              {currentSlide.description && (
                <p className="mt-1">{currentSlide.description}</p>
              )}
            </div>
          ),
        }}
        styles={{
          container: { backgroundColor: "rgba(0, 0, 0, 0.9)" },
        }}
      />
    );
  };

  // Create a new div for the Lightbox
  const rootDiv = document.createElement("div");
  rootDiv.id = "lightbox-root";
  document.body.appendChild(rootDiv);

  // Use createRoot to mount the Lightbox component
  const root = createRoot(rootDiv);
  root.render(<LightboxComponent />);
};

export default openLightbox;
