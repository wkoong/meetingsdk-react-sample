import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";

const PictureInPictureContext = createContext(undefined)
console.log('qqq context', PictureInPictureContext)
export function PictureInPictureProvider({ children }) {
    // Detect if the feature is available.
    const isSupported = "documentPictureInPicture" in window;

    // Expose pipWindow that is currently active
    const [pipWindow, setPipWindow] = useState(null);

    // Open new pipWindow
    const requestPipWindow = useCallback(
        async (width = 500, height = 500) => {
            // We don't want to allow multiple requests.
            if (pipWindow != null) {
                return;
            }

            const pip = await window.documentPictureInPicture.requestWindow({
                width,
                height,
            });

            // Detect when window is closed by user
            // pip.addEventListener("pagehide", () => {
            //     setPipWindow(null);
            // });

            // It is important to copy all parent widnow styles. Otherwise, there would be no CSS available at all
            // https://developer.chrome.com/docs/web-platform/document-picture-in-picture/#copy-style-sheets-to-the-picture-in-picture-window
            [...document.styleSheets].forEach((styleSheet) => {
                try {
                    const cssRules = [...styleSheet.cssRules]
                        .map((rule) => rule.cssText)
                        .join("");
                    const style = document.createElement("style");

                    style.textContent = cssRules;
                    pip.document.head.appendChild(style);
                } catch (e) {
                    const link = document.createElement("link");
                    if (styleSheet.href == null) {
                        return;
                    }

                    link.rel = "stylesheet";
                    link.type = styleSheet.type;
                    link.media = styleSheet.media.toString();
                    link.href = styleSheet.href;
                    pip.document.head.appendChild(link);
                }
            });

            // Adding Zoom peer dependencies and css files to the PIP window
            document.querySelectorAll('script').forEach((script) => {
                pip.document.head.appendChild(script);
            })

            const ZoomVideo = document.getElementById('zmmtg-root');
            pip.document.body.append(ZoomVideo);

            setPipWindow(pip);
        },
        [pipWindow]
    );

    const value = useMemo(() => {
        {
            return {
                isSupported,
                pipWindow,
                requestPipWindow,
                // closePipWindow,
            };
        }
    }, [isSupported, pipWindow, requestPipWindow]);

    return <PictureInPictureContext.Provider value={value}>{children}</PictureInPictureContext.Provider>;
}

export function usePiPWindow() {
    const context = useContext(PictureInPictureContext);

    if (context === undefined) {
        throw new Error("usePiPWindow must be used within a PiPContext");
    }

    return context;
}