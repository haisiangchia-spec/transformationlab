import {
  useEffect,
  useId,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import startArt from "../../docs/handoff/references/start_screen.png";
import { CARDS, type CardId } from "../engine";
export const num = (n: number) =>
  new Intl.NumberFormat("en-SG", { maximumFractionDigits: 2 }).format(n);
export const categoryInfo = {
  T: {
    name: "Teacher",
    full: "Teacher Professional Capacity",
    color: "#bd9aff",
    icon: "people",
  },
  S: {
    name: "Student",
    full: "Student Digital & AI Agency",
    color: "#46ebc2",
    icon: "graduate",
  },
  P: {
    name: "Pedagogy",
    full: "Pedagogy & Assessment",
    color: "#f3ca63",
    icon: "book",
  },
  I: {
    name: "Infrastructure",
    full: "Technology & Data Infrastructure",
    color: "#4ecbff",
    icon: "building",
  },
  L: {
    name: "Leadership",
    full: "School Leadership & Culture",
    color: "#ffbd66",
    icon: "compass",
  },
  G: {
    name: "Governance",
    full: "Trust, Governance & Partnerships",
    color: "#86b8ff",
    icon: "shield",
  },
} as const;
export type Category = keyof typeof categoryInfo;
export function category(id: CardId) {
  return categoryInfo[id[0] as Category];
}
export const card = (id: CardId) => CARDS.find((c) => c.id === id)!;
export function Icon({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  const paths: Record<string, ReactNode> = {
    book: (
      <>
        <path d="M12 6c-3-3-7-3-10-2v15c3-1 7-1 10 2 3-3 7-3 10-2V4c-3-1-7-1-10 2Z" />
        <path d="M12 6v15" />
      </>
    ),
    people: (
      <>
        <circle cx="12" cy="7" r="3" />
        <path d="M6 21v-3a6 6 0 0 1 12 0v3M3 10a3 3 0 0 0 0 6M21 10a3 3 0 0 1 0 6M2 21v-2M22 21v-2" />
      </>
    ),
    graduate: (
      <>
        <path d="m2 8 10-5 10 5-10 5L2 8Zm4 3v7l6 3 6-3v-7M22 8v9" />
      </>
    ),
    building: (
      <>
        <path d="M3 21V7l9-4 9 4v14H3ZM9 21v-6h6v6M7 9v2M12 8v3M17 9v2" />
      </>
    ),
    compass: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="m16 8-2 6-6 2 2-6 6-2Z" />
      </>
    ),
    shield: (
      <>
        <path d="m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6l9-4Z" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
    layers: (
      <>
        <path d="m2 7 10-5 10 5-10 5L2 7Zm0 5 10 5 10-5M2 17l10 5 10-5" />
      </>
    ),
    network: (
      <>
        <circle cx="12" cy="4" r="3" />
        <circle cx="4" cy="19" r="3" />
        <circle cx="20" cy="19" r="3" />
        <path d="m10 7-4 9m8-9 4 9M7 19h10" />
      </>
    ),
    arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
    shuffle: (
      <>
        <path d="M3 6h3c5 0 7 12 12 12h3m-4-4 4 4-4 4M3 18h3c2 0 4-2 6-6s4-6 6-6h3m-4-4 4 4-4 4" />
      </>
    ),
    target: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4" />
        <path d="m12 12 9-9M16 3h5v5" />
      </>
    ),
    menu: <path d="M3 5h18M3 12h18M3 19h18" />,
    close: <path d="m5 5 14 14M5 19 19 5" />,
    check: <path d="m4 12 5 5L20 6" />,
    play: <path d="m7 3 14 9-14 9V3Z" fill="currentColor" stroke="none" />,
    plus: <path d="M12 4v16M4 12h16" />,
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2" />
      </>
    ),
  };
  return (
    <svg
      className={`icon ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] ?? paths.network}
    </svg>
  );
}
export function Brand() {
  return (
    <div className="brand">
      <svg viewBox="0 0 48 52" aria-hidden="true">
        <path
          d="m24 2 21 12v25L24 51 3 39V14L24 2Zm0 9L11 19v15l13 8 13-8V19l-13-8Zm-8 10 8-5 8 5-8 5-8-5Zm0 0v10l8 5 8-5V21"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        />
      </svg>
      <span>
        SCHOOL
        <br />
        TRANSFORMATION <b>LAB</b>
      </span>
    </div>
  );
}
export function Art({
  scene,
  className = "",
}: {
  scene: "hero" | "technology" | "teacher" | "student" | "leadership";
  className?: string;
}) {
  const boxes = {
    hero: "1020 0 650 350",
    technology: "74 528 267 107",
    teacher: "394 529 266 108",
    student: "713 529 267 108",
    leadership: "1032 529 267 108",
  };
  return (
    <svg
      className={`reference-art ${className}`}
      viewBox={boxes[scene]}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <image href={startArt} width="1672" height="941" />
    </svg>
  );
}
export function CardTag({
  id,
  owned = false,
}: {
  id: CardId;
  owned?: boolean;
}) {
  return (
    <span
      className={`card-tag ${owned ? "is-owned" : ""}`}
      style={{ "--accent": category(id).color } as CSSProperties}
      title={card(id).name}
    >
      {owned && <Icon name="check" />}
      {id}
    </span>
  );
}
export function Modal({
  title,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const dialog = ref.current;
    dialog?.showModal();
    return () => {
      dialog?.close();
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      className={wide ? "modal wide" : "modal"}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-heading">
        <h2 id={titleId}>{title}</h2>
        <button
          className="icon-button"
          aria-label="Close dialog"
          onClick={onClose}
        >
          <Icon name="close" />
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function Footer() {
  return (
    <footer>
      <span>SCHOOL TRANSFORMATION LAB</span>
      <i />
      <span>A Game for School Leaders</span>
    </footer>
  );
}
