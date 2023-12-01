import { createPortal } from "react-dom";

// type PiPWindowProps = {
//   pipWindow: Window;
//   children: React.ReactNode;
// };

export default function PiPWindow({ pipWindow, children }) {
    return createPortal(children, pipWindow.document.body);
}