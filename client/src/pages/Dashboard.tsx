import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

interface Email {
  id: string;
  senderEmail: string;
  senderName: string;
  recipient: string;
  subject: string;
  body: string;
  scheduledAt: string;
  sentAt: string | null;
  status: string;
}

interface User {
  id: string;
  name: string | null;
  email: string;
  picture: string | null;
}

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

function Icon({
  name,
  size = 20,
}: {
  name:
    | "dashboard"
    | "search"
    | "clock"
    | "send"
    | "settings"
    | "plus"
    | "refresh"
    | "mail"
    | "close"
    | "upload"
    | "calendar"
    | "chevron"
    | "logout"
    | "rocket"
    | "check"
    | "warning";
  size?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (name === "dashboard") {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    );
  }

  if (name === "search") {
    return (
      <svg {...common}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </svg>
    );
  }

  if (name === "clock") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7v5l3 2" />
      </svg>
    );
  }

  if (name === "send") {
    return (
      <svg {...common}>
        <path d="M21 3 10 14" />
        <path d="m21 3-7 18-4-7-7-4Z" />
      </svg>
    );
  }

  if (name === "settings") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.5 1.5-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V20h-2.1v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-1.5-1.5.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H7v-2.1h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.5-1.5.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V4H15v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.5 1.5-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.2v2.1h-.2a1.7 1.7 0 0 0-1.1 1.2Z" />
      </svg>
    );
  }

  if (name === "plus") {
    return (
      <svg {...common}>
        <path d="M12 5v14M5 12h14" />
      </svg>
    );
  }

  if (name === "refresh") {
    return (
      <svg {...common}>
        <path d="M20 11a8.1 8.1 0 0 0-14.8-4L3 10" />
        <path d="M3 5v5h5" />
        <path d="M4 13a8.1 8.1 0 0 0 14.8 4L21 14" />
        <path d="M21 19v-5h-5" />
      </svg>
    );
  }

  if (name === "mail") {
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    );
  }

  if (name === "close") {
    return (
      <svg {...common}>
        <path d="m6 6 12 12M18 6 6 18" />
      </svg>
    );
  }

  if (name === "upload") {
    return (
      <svg {...common}>
        <path d="M12 16V4" />
        <path d="m7 9 5-5 5 5" />
        <path d="M5 20h14" />
      </svg>
    );
  }

  if (name === "calendar") {
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </svg>
    );
  }

  if (name === "chevron") {
    return (
      <svg {...common}>
        <path d="m9 18 6-6-6-6" />
      </svg>
    );
  }

  if (name === "logout") {
    return (
      <svg {...common}>
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H3" />
        <path d="M14 4h5a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-5" />
      </svg>
    );
  }

  if (name === "rocket") {
    return (
      <svg {...common}>
        <path d="M14 4c2.8-2.1 5.5-2 6-2 .1.5.1 3.2-2 6l-5.8 5.8-4-4Z" />
        <path d="M8.2 9.8 4 10l-2 4 6-.2M14.2 15.8 14 20l-4 2 .2-6" />
        <circle cx="15.5" cy="8.5" r="1.2" />
      </svg>
    );
  }

  if (name === "warning") {
    return (
      <svg {...common}>
        <path d="M10.3 4.1 2.6 17.5A2 2 0 0 0 4.3 20h15.4a2 2 0 0 0 1.7-2.5L13.7 4.1a2 2 0 0 0-3.4 0Z" />
        <path d="M12 9v4" />
        <path d="M12 16h.01" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function Dashboard({ user, onLogout }: DashboardProps) {
  const [showForm, setShowForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const [activeTab, setActiveTab] = useState<"scheduled" | "sent">(
    "scheduled"
  );

  const [scheduledEmails, setScheduledEmails] = useState<Email[]>([]);
  const [sentEmails, setSentEmails] = useState<Email[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Email[]>([]);
  const [searching, setSearching] = useState(false);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    senderEmail: user.email,
    senderName: user.name || "",
    subject: "",
    body: "",
    scheduledAt: "",
    delay: 10,
    hourlyLimit: 50,
  });

  const [leads, setLeads] = useState<string[]>([]);
  const [fileName, setFileName] = useState("");

  // ================= API BASE URL =================

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  // ================= POPUP STATE =================

  const [popup, setPopup] = useState<{
    show: boolean;
    type: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
  }>({
    show: false,
    type: "info",
    title: "",
    message: "",
  });

  const [confirmPopup, setConfirmPopup] = useState<{
    show: boolean;
    title: string;
    message: string;
    onConfirm: (() => void) | null;
  }>({
    show: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  // ================= POPUP HELPERS =================

  const showPopup = (
    type: "success" | "error" | "warning" | "info",
    title: string,
    message: string
  ) => {
    setPopup({
      show: true,
      type,
      title,
      message,
    });

    setTimeout(() => {
      setPopup((prev) => ({
        ...prev,
        show: false,
      }));
    }, 3500);
  };

  const closePopup = () => {
    setPopup((prev) => ({
      ...prev,
      show: false,
    }));
  };

  const showConfirmation = (
    title: string,
    message: string,
    onConfirm: () => void
  ) => {
    setConfirmPopup({
      show: true,
      title,
      message,
      onConfirm,
    });
  };

  const closeConfirmation = () => {
    setConfirmPopup({
      show: false,
      title: "",
      message: "",
      onConfirm: null,
    });
  };

  const handleConfirm = () => {
    if (confirmPopup.onConfirm) {
      confirmPopup.onConfirm();
    }

    closeConfirmation();
  };

  // ================= THEME =================

  useEffect(() => {
    const savedTheme = localStorage.getItem("reachinbox-theme");

    const currentTheme =
      savedTheme === "light" || savedTheme === "dark"
        ? savedTheme
        : "dark";

    setTheme(currentTheme);

    document.documentElement.classList.toggle(
      "reachinbox-light",
      currentTheme === "light"
    );
  }, []);

  const handleThemeChange = (newTheme: "dark" | "light") => {
    setTheme(newTheme);

    localStorage.setItem("reachinbox-theme", newTheme);

    document.documentElement.classList.toggle(
      "reachinbox-light",
      newTheme === "light"
    );
  };

  // ================= FETCH EMAILS =================

  const fetchEmails = async () => {
    try {
      const senderEmail = encodeURIComponent(user.email);

      const [scheduledResponse, sentResponse] = await Promise.all([
        fetch(
          `${API_URL}/api/emails/scheduled?senderEmail=${senderEmail}`
        ),
        fetch(
          `${API_URL}/api/emails/sent?senderEmail=${senderEmail}`
        ),
      ]);

      if (!scheduledResponse.ok || !sentResponse.ok) {
        throw new Error("Failed to fetch emails");
      }

      const scheduledData = await scheduledResponse.json();
      const sentData = await sentResponse.json();

      console.log("Scheduled emails:", scheduledData);
      console.log("Sent emails:", sentData);

      setScheduledEmails(scheduledData.emails || []);
      setSentEmails(sentData.emails || []);
    } catch (error) {
      console.error("Failed to fetch emails:", error);
    }
  };

  // ================= CANCEL / DELETE EMAIL =================

  const handleCancel = (emailId: string) => {
    showConfirmation(
      "Remove Email?",
      "Are you sure you want to remove this email? This action cannot be undone.",
      async () => {
        try {
          const response = await fetch(
            `${API_URL}/api/emails/${emailId}`,
            {
              method: "DELETE",
            }
          );

          if (!response.ok) {
            throw new Error("Failed to cancel email");
          }

          showPopup(
            "success",
            "Email Removed",
            "The email was removed successfully."
          );

          await fetchEmails();
        } catch (error) {
          console.error("Cancel email error:", error);

          showPopup(
            "error",
            "Removal Failed",
            "Failed to remove the email. Please try again."
          );
        }
      }
    );
  };

  // ================= AUTO REFRESH =================

  useEffect(() => {
    fetchEmails();

    const interval = setInterval(() => {
      fetchEmails();
    }, 5000);

    return () => clearInterval(interval);
  }, [user.email]);

  // ================= SEARCH =================

  useEffect(() => {
    const query = searchQuery.trim();

    if (!query) {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setSearching(true);

        const response = await fetch(
          `${API_URL}/api/emails/search?q=${encodeURIComponent(
            query
          )}&senderEmail=${encodeURIComponent(user.email)}`
        );

        if (!response.ok) {
          throw new Error("Search request failed");
        }

        const data = await response.json();

        setSearchResults(
          Array.isArray(data.emails) ? data.emails : []
        );
      } catch (error) {
        console.error("Email search failed:", error);
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, user.email]);

  // ================= FILE UPLOAD =================

  const handleFileUpload = async (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      const text = await file.text();

      const entries = text
        .split(/[\s,;\n\r]+/)
        .map((entry) => entry.trim())
        .filter(Boolean);

      const emailRegex =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      const dataEntries = entries.filter(
        (entry) =>
          ![
            "email",
            "emails",
            "email address",
            "email_address",
          ].includes(entry.toLowerCase())
      );

      const validEmails = dataEntries.filter((entry) =>
        emailRegex.test(entry)
      );

      const uniqueEmails = [...new Set(validEmails)];

      const invalidEmails = dataEntries.filter(
        (entry) => !emailRegex.test(entry)
      );

      setLeads(uniqueEmails);
      setFileName(file.name);

      if (uniqueEmails.length === 0) {
        showPopup(
          "error",
          "No Valid Emails",
          "No valid email addresses were found in the uploaded file."
        );
        return;
      }

      if (invalidEmails.length > 0) {
        showPopup(
          "warning",
          "Some Emails Skipped",
          `${uniqueEmails.length} valid email addresses detected. ${invalidEmails.length} invalid email address(es) were skipped.`
        );
      } else {
        showPopup(
          "success",
          "File Uploaded",
          `${uniqueEmails.length} valid email address${
            uniqueEmails.length !== 1 ? "es" : ""
          } detected successfully.`
        );
      }
    } catch (error) {
      console.error("File upload error:", error);

      showPopup(
        "error",
        "Upload Failed",
        "Failed to read the file. Please try again."
      );
    }
  };

  // ================= SCHEDULE EMAIL =================

  const handleSchedule = async (e: FormEvent) => {
    e.preventDefault();

    if (leads.length === 0) {
      showPopup(
        "warning",
        "Recipients Required",
        "Please upload a CSV or TXT file containing email addresses."
      );
      return;
    }

    if (!form.scheduledAt) {
      showPopup(
        "warning",
        "Schedule Time Required",
        "Please select a start date and time."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/emails/schedule-bulk`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            senderEmail: form.senderEmail,
            senderName: form.senderName,
            recipients: leads,
            subject: form.subject,
            body: form.body,
            startTime: new Date(form.scheduledAt).toISOString(),
            delay: form.delay,
            hourlyLimit: form.hourlyLimit,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to schedule emails"
        );
      }

      showPopup(
        "success",
        "Emails Scheduled",
        data.message || "Emails scheduled successfully."
      );

      setForm({
        senderEmail: user.email,
        senderName: user.name || "",
        subject: "",
        body: "",
        scheduledAt: "",
        delay: 10,
        hourlyLimit: 50,
      });

      setLeads([]);
      setFileName("");
      setShowForm(false);

      await fetchEmails();
    } catch (error) {
      console.error("Schedule error:", error);

      showPopup(
        "error",
        "Scheduling Failed",
        error instanceof Error
          ? error.message
          : "Failed to schedule emails."
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= FILTER EMAILS =================

  const baseEmails =
    activeTab === "scheduled"
      ? scheduledEmails
      : sentEmails;

  const emails = searchQuery.trim()
    ? searchResults.filter((email) =>
        activeTab === "scheduled"
          ? email.status === "SCHEDULED"
          : email.status === "SENT" ||
            email.status === "FAILED"
      )
    : baseEmails;

  return (
    <>
      {/* ================= LIGHT THEME OVERRIDES ================= */}

      <style>{`
        .reachinbox-light {
          background: #f5f7fa !important;
          color: #111827 !important;
        }

        .reachinbox-light .bg-\\[\\#07090c\\] {
          background-color: #f5f7fa !important;
        }

        .reachinbox-light .bg-\\[\\#090b0f\\] {
          background-color: #ffffff !important;
        }

        .reachinbox-light .bg-\\[\\#0d1116\\] {
          background-color: #ffffff !important;
        }

        .reachinbox-light .bg-\\[\\#10141a\\] {
          background-color: #f8fafc !important;
        }

        .reachinbox-light .bg-\\[\\#090c10\\] {
          background-color: #f8fafc !important;
        }

        .reachinbox-light .bg-\\[\\#11161c\\] {
          background-color: #f1f5f9 !important;
        }

        .reachinbox-light .bg-\\[\\#141920\\] {
          background-color: #e8eef7 !important;
        }

        .reachinbox-light .bg-\\[\\#151a20\\] {
          background-color: #e5e7eb !important;
        }

        .reachinbox-light .bg-\\[\\#151a21\\] {
          background-color: #e5e7eb !important;
        }

        .reachinbox-light .bg-\\[\\#172238\\] {
          background-color: #eaf2ff !important;
        }

        .reachinbox-light .bg-\\[\\#152238\\] {
          background-color: #eaf2ff !important;
        }

        .reachinbox-light .bg-\\[\\#1b2638\\] {
          background-color: #e8eef7 !important;
        }

        .reachinbox-light .bg-\\[\\#1c2634\\] {
          background-color: #e5edf9 !important;
        }

        .reachinbox-light .bg-\\[\\#1d2938\\] {
          background-color: #e8f1ff !important;
        }

        .reachinbox-light .bg-\\[\\#201c30\\] {
          background-color: #f0ebff !important;
        }

        .reachinbox-light .bg-\\[\\#14251f\\] {
          background-color: #e9f9ef !important;
        }

        .reachinbox-light .bg-\\[\\#211114\\] {
          background-color: #fff1f2 !important;
        }

        .reachinbox-light .bg-\\[\\#101925\\] {
          background-color: #eff6ff !important;
        }

        .reachinbox-light .border-\\[\\#1d2229\\] {
          border-color: #e5e7eb !important;
        }

        .reachinbox-light .border-\\[\\#20262e\\] {
          border-color: #e5e7eb !important;
        }

        .reachinbox-light .border-\\[\\#222831\\] {
          border-color: #e5e7eb !important;
        }

        .reachinbox-light .border-\\[\\#252c34\\] {
          border-color: #dfe3e8 !important;
        }

        .reachinbox-light .border-\\[\\#252a31\\] {
          border-color: #e5e7eb !important;
        }

        .reachinbox-light .border-\\[\\#252b33\\] {
          border-color: #d8dde5 !important;
        }

        .reachinbox-light .border-\\[\\#293039\\] {
          border-color: #d1d5db !important;
        }

        .reachinbox-light .border-\\[\\#303640\\] {
          border-color: #d1d5db !important;
        }

        .reachinbox-light .border-\\[\\#303842\\] {
          border-color: #cbd5e1 !important;
        }

        .reachinbox-light .border-\\[\\#25344a\\] {
          border-color: #bfdbfe !important;
        }

        .reachinbox-light .text-white {
          color: #111827 !important;
        }

        .reachinbox-light .text-\\[\\#f3f4f6\\] {
          color: #111827 !important;
        }

        .reachinbox-light .text-\\[\\#eef0f3\\] {
          color: #111827 !important;
        }

        .reachinbox-light .text-\\[\\#e7e9ed\\] {
          color: #1f2937 !important;
        }

        .reachinbox-light .text-\\[\\#e5e7eb\\] {
          color: #1f2937 !important;
        }

        .reachinbox-light .text-\\[\\#e3e6eb\\] {
          color: #1f2937 !important;
        }

        .reachinbox-light .text-\\[\\#dfe2e7\\] {
          color: #1f2937 !important;
        }

        .reachinbox-light .text-\\[\\#d4d8de\\] {
          color: #374151 !important;
        }

        .reachinbox-light .text-\\[\\#cbd0d7\\] {
          color: #374151 !important;
        }

        .reachinbox-light .text-\\[\\#b8bec6\\] {
          color: #4b5563 !important;
        }

        .reachinbox-light .text-\\[\\#aeb5be\\] {
          color: #4b5563 !important;
        }

        .reachinbox-light .text-\\[\\#9aa2ad\\] {
          color: #4b5563 !important;
        }

        .reachinbox-light .text-\\[\\#858d98\\] {
          color: #6b7280 !important;
        }

        .reachinbox-light .text-\\[\\#7b8490\\] {
          color: #6b7280 !important;
        }

        .reachinbox-light .text-\\[\\#777f8a\\] {
          color: #6b7280 !important;
        }

        .reachinbox-light .text-\\[\\#737b87\\] {
          color: #6b7280 !important;
        }

        .reachinbox-light .text-\\[\\#737c87\\] {
          color: #6b7280 !important;
        }

        .reachinbox-light .text-\\[\\#707984\\] {
          color: #6b7280 !important;
        }

        .reachinbox-light .text-\\[\\#69727e\\] {
          color: #6b7280 !important;
        }

        .reachinbox-light .text-\\[\\#68717d\\] {
          color: #6b7280 !important;
        }

        .reachinbox-light .text-\\[\\#626b77\\] {
          color: #6b7280 !important;
        }

        .reachinbox-light .text-\\[\\#626b76\\] {
          color: #6b7280 !important;
        }

        .reachinbox-light .text-\\[\\#5f6873\\] {
          color: #6b7280 !important;
        }

        .reachinbox-light .text-\\[\\#59626e\\] {
          color: #6b7280 !important;
        }

        .reachinbox-light .text-\\[\\#555d68\\] {
          color: #6b7280 !important;
        }

        .reachinbox-light .text-\\[\\#555e69\\] {
          color: #6b7280 !important;
        }

        .reachinbox-light .text-\\[\\#4f5661\\] {
          color: #9ca3af !important;
        }

        .reachinbox-light input,
        .reachinbox-light textarea {
          color: #111827 !important;
        }

        .reachinbox-light input::placeholder,
        .reachinbox-light textarea::placeholder {
          color: #9ca3af !important;
        }

        @keyframes popupSlideIn {
          from {
            opacity: 0;
            transform: translateY(-15px) scale(0.97);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .popup-animation {
          animation: popupSlideIn 0.2s ease-out;
        }
      `}</style>

      {/* ================= NOTIFICATION POPUP ================= */}

      {popup.show && (
        <div className="fixed top-5 right-5 z-[200] w-full max-w-sm popup-animation">
          <div
            className={`rounded-[14px] border shadow-2xl backdrop-blur-xl p-4 ${
              popup.type === "success"
                ? "bg-[#0d2117] border-[#205b38]"
                : popup.type === "error"
                ? "bg-[#241215] border-[#633036]"
                : popup.type === "warning"
                ? "bg-[#251f0d] border-[#66531b]"
                : "bg-[#101925] border-[#253f63]"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-9 h-9 rounded-[9px] shrink-0 flex items-center justify-center ${
                  popup.type === "success"
                    ? "bg-[#143221] text-[#4ade80]"
                    : popup.type === "error"
                    ? "bg-[#32171a] text-[#f87171]"
                    : popup.type === "warning"
                    ? "bg-[#3a2d0c] text-[#facc15]"
                    : "bg-[#172238] text-[#60a5fa]"
                }`}
              >
                {popup.type === "success" ? (
                  <Icon name="check" size={18} />
                ) : popup.type === "error" ? (
                  <Icon name="close" size={18} />
                ) : popup.type === "warning" ? (
                  <Icon name="warning" size={18} />
                ) : (
                  <Icon name="mail" size={18} />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className={`text-[13px] font-semibold ${
                    popup.type === "success"
                      ? "text-[#86efac]"
                      : popup.type === "error"
                      ? "text-[#fca5a5]"
                      : popup.type === "warning"
                      ? "text-[#fde68a]"
                      : "text-[#93c5fd]"
                  }`}
                >
                  {popup.title}
                </p>

                <p className="text-[11px] leading-5 text-[#aeb5be] mt-1">
                  {popup.message}
                </p>
              </div>

              <button
                type="button"
                onClick={closePopup}
                className="w-6 h-6 shrink-0 rounded-md text-[#69727e] hover:text-white hover:bg-white/5 flex items-center justify-center transition"
              >
                <Icon name="close" size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CONFIRMATION POPUP ================= */}

      {confirmPopup.show && (
        <div className="fixed inset-0 z-[250] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0d1116] border border-[#252c34] rounded-[16px] shadow-2xl popup-animation">
            <div className="p-6">
              <div className="w-11 h-11 rounded-[11px] bg-[#32171a] text-[#f87171] flex items-center justify-center mb-4">
                <Icon name="warning" size={21} />
              </div>

              <h2 className="text-[16px] font-semibold text-[#eef0f3]">
                {confirmPopup.title}
              </h2>

              <p className="text-[12px] leading-5 text-[#737b87] mt-2">
                {confirmPopup.message}
              </p>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeConfirmation}
                  className="h-10 px-4 rounded-[9px] border border-[#293039] text-[#9aa2ad] hover:bg-[#151a20] hover:text-white transition text-[12px] font-medium"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleConfirm}
                  className="h-10 px-4 rounded-[9px] bg-[#dc2626] hover:bg-[#b91c1c] text-white transition text-[12px] font-semibold"
                >
                  Yes, Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MAIN DASHBOARD ================= */}

      <div
        className={`min-h-screen flex ${
          theme === "light"
            ? "bg-gray-50 text-gray-900"
            : "bg-[#07090c] text-white"
        }`}
      >
        {/* ================= SIDEBAR ================= */}

        <aside className="w-[250px] shrink-0 border-r border-[#1d2229] bg-[#090b0f] min-h-screen flex flex-col">
          <div className="h-[82px] px-7 flex items-center border-b border-[#1d2229]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[10px] bg-[#3b82f6] flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="font-bold text-white text-lg">
                  R
                </span>
              </div>

              <div>
                <h1 className="font-semibold text-[16px] tracking-[-0.02em]">
                  ReachInbox
                </h1>

                <p className="text-[11px] text-[#737b87] mt-0.5">
                  Email Scheduler
                </p>
              </div>
            </div>
          </div>

          <div className="px-4 pt-7">
            <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#555d68]">
              Workspace
            </p>

            <nav className="space-y-1">
              <button
                onClick={() => {
                  setActiveTab("scheduled");
                  setShowForm(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[9px] text-sm transition ${
                  activeTab === "scheduled"
                    ? "bg-[#141920] text-white"
                    : "text-[#858d98] hover:bg-[#11151b] hover:text-white"
                }`}
              >
                <Icon name="dashboard" size={18} />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("scheduled");
                  setShowForm(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[9px] text-sm transition ${
                  activeTab === "scheduled"
                    ? "text-white"
                    : "text-[#858d98] hover:bg-[#11151b] hover:text-white"
                }`}
              >
                <Icon name="clock" size={18} />
                <span>Scheduled Emails</span>

                {scheduledEmails.length > 0 && (
                  <span className="ml-auto text-[10px] bg-[#1c2634] text-[#8eb9ff] px-2 py-0.5 rounded-full">
                    {scheduledEmails.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setActiveTab("sent");
                  setShowForm(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[9px] text-sm transition ${
                  activeTab === "sent"
                    ? "bg-[#141920] text-white"
                    : "text-[#858d98] hover:bg-[#11151b] hover:text-white"
                }`}
              >
                <Icon name="send" size={18} />
                <span>Sent Emails</span>

                {sentEmails.length > 0 && (
                  <span className="ml-auto text-[10px] bg-[#1c2634] text-[#8eb9ff] px-2 py-0.5 rounded-full">
                    {sentEmails.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowSettings(true)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[9px] text-sm transition ${
                  showSettings
                    ? "bg-[#141920] text-white"
                    : "text-[#858d98] hover:bg-[#11151b] hover:text-white"
                }`}
              >
                <Icon name="settings" size={18} />
                <span>Settings</span>
              </button>
            </nav>
          </div>

          <div className="mt-auto p-4">
            <div className="rounded-[14px] border border-[#222831] bg-[#10141a] p-4">
              <div className="w-9 h-9 rounded-lg bg-[#172238] text-[#60a5fa] flex items-center justify-center mb-3">
                <Icon name="rocket" size={18} />
              </div>

              <h3 className="text-sm font-semibold">
                Boost your outreach
              </h3>

              <p className="text-[11px] leading-5 text-[#737b87] mt-1.5">
                Automate your outreach and reach more people with ReachInbox.
              </p>

              <button className="mt-3 text-xs font-medium text-[#60a5fa] hover:text-blue-300 flex items-center gap-1">
                Learn more
                <Icon name="chevron" size={13} />
              </button>
            </div>

            <div className="mt-4 px-3 text-[10px] text-[#4f5661]">
              ReachInbox v1.0
            </div>
          </div>
        </aside>

        {/* ================= MAIN ================= */}

        <div className="flex-1 min-w-0">
          <header className="h-[82px] border-b border-[#1d2229] bg-[#090b0f] flex items-center justify-between px-8">
            <div>
              <p className="text-xs text-[#656d78]">
                Workspace
              </p>

              <p className="text-sm font-medium text-[#cbd0d7] mt-1">
                Email Campaigns
              </p>
            </div>

            <div className="flex items-center gap-5">
              <button
                onClick={() => setShowForm(true)}
                className="h-10 px-4 rounded-[9px] bg-[#2563eb] hover:bg-[#1d4ed8] transition flex items-center gap-2 text-sm font-semibold shadow-lg shadow-blue-600/10"
              >
                <Icon name="plus" size={17} />
                Compose New Email
              </button>

              <div className="h-8 w-px bg-[#252a31]" />

              <div className="flex items-center gap-3">
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name || "User"}
                    className="w-9 h-9 rounded-full object-cover border border-[#303640]"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#1b2638] border border-[#2b3a52] flex items-center justify-center text-sm font-semibold text-[#8db9ff]">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}

                <div className="hidden md:block max-w-[180px]">
                  <p className="text-sm font-medium text-[#e3e6eb] truncate">
                    {user.name || "User"}
                  </p>

                  <p className="text-[11px] text-[#686f7a] truncate mt-0.5">
                    {user.email}
                  </p>
                </div>

                <button
                  onClick={onLogout}
                  title="Logout"
                  className="ml-1 p-2 rounded-lg text-[#737b87] hover:text-white hover:bg-[#151a21] transition"
                >
                  <Icon name="logout" size={18} />
                </button>
              </div>
            </div>
          </header>

          <main className="px-8 py-8 max-w-[1400px] mx-auto">
            {/* ================= PAGE TITLE ================= */}

            <div className="mb-7">
              <p className="text-[12px] font-medium text-[#66707d] mb-2">
                OVERVIEW
              </p>

              <h2 className="text-[30px] leading-tight font-semibold tracking-[-0.035em] text-[#f3f4f6]">
                Hello ,{" "}
                {user.name?.split(" ")[0] || "there"}! 👋
              </h2>

              <p className="text-sm text-[#707984] mt-2">
                Schedule, manage and track your emails.
              </p>
            </div>

            {/* ================= STATISTICS ================= */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="rounded-[14px] border border-[#20262e] bg-[#0d1116] p-5 hover:border-[#2a323c] transition">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-[10px] bg-[#152238] text-[#60a5fa] flex items-center justify-center">
                    <Icon name="clock" size={19} />
                  </div>

                  <div className="w-7 h-7 rounded-full border border-[#252b33] flex items-center justify-center text-[#6e7681]">
                    <Icon name="chevron" size={14} />
                  </div>
                </div>

                <p className="text-[12px] text-[#737c87] mt-5">
                  Scheduled Emails
                </p>

                <p className="text-[28px] font-semibold tracking-[-0.03em] mt-1">
                  {scheduledEmails.length}
                </p>

                <p className="text-[11px] text-[#555e69] mt-1">
                  Emails waiting to be sent
                </p>
              </div>

              <div className="rounded-[14px] border border-[#20262e] bg-[#0d1116] p-5 hover:border-[#2a323c] transition">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-[10px] bg-[#14251f] text-[#4ade80] flex items-center justify-center">
                    <Icon name="send" size={19} />
                  </div>

                  <div className="w-7 h-7 rounded-full border border-[#252b33] flex items-center justify-center text-[#6e7681]">
                    <Icon name="chevron" size={14} />
                  </div>
                </div>

                <p className="text-[12px] text-[#737c87] mt-5">
                  Sent Emails
                </p>

                <p className="text-[28px] font-semibold tracking-[-0.03em] mt-1">
                  {sentEmails.length}
                </p>

                <p className="text-[11px] text-[#555e69] mt-1">
                  Successfully delivered
                </p>
              </div>

              <div className="rounded-[14px] border border-[#20262e] bg-[#0d1116] p-5 hover:border-[#2a323c] transition">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-[10px] bg-[#201c30] text-[#a78bfa] flex items-center justify-center">
                    <Icon name="mail" size={19} />
                  </div>

                  <div className="w-7 h-7 rounded-full border border-[#252b33] flex items-center justify-center text-[#6e7681]">
                    <Icon name="chevron" size={14} />
                  </div>
                </div>

                <p className="text-[12px] text-[#737c87] mt-5">
                  Queue
                </p>

                <p className="text-[28px] font-semibold tracking-[-0.03em] mt-1">
                  {scheduledEmails.length}
                </p>

                <p className="text-[11px] text-[#555e69] mt-1">
                  Jobs waiting in queue
                </p>
              </div>
            </div>

            {/* ================= EMAIL ACTIVITY ================= */}

            <section className="rounded-[14px] border border-[#20262e] bg-[#0d1116] overflow-hidden">
              <div className="px-5 pt-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[15px] font-semibold text-[#e7e9ed]">
                      Email Activity
                    </h3>

                    <p className="text-[11px] text-[#626b77] mt-1">
                      View and manage your email activity
                    </p>
                  </div>

                  <button
                    onClick={fetchEmails}
                    title="Refresh"
                    className="w-9 h-9 rounded-[9px] border border-[#252c34] text-[#7b8490] hover:text-white hover:bg-[#151a20] transition flex items-center justify-center"
                  >
                    <Icon name="refresh" size={16} />
                  </button>
                </div>

                {/* ================= SEARCH ================= */}

                <div className="mt-5">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#68717d] pointer-events-none">
                      <Icon name="search" size={16} />
                    </div>

                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) =>
                        setSearchQuery(e.target.value)
                      }
                      placeholder="Search recipient, subject, body or sender..."
                      className="w-full h-11 bg-[#090c10] border border-[#252c34] rounded-[9px] pl-10 pr-10 text-[12px] text-white outline-none focus:border-[#3b82f6] transition"
                    />

                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        title="Clear search"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#68717d] hover:text-white transition"
                      >
                        <Icon name="close" size={15} />
                      </button>
                    )}
                  </div>

                  {searching && (
                    <p className="text-[10px] text-[#68717d] mt-1.5">
                      Searching...
                    </p>
                  )}

                  {!searching &&
                    searchQuery.trim() &&
                    searchResults.length === 0 && (
                      <p className="text-[10px] text-[#68717d] mt-1.5">
                        No matching emails found.
                      </p>
                    )}
                </div>

                {/* ================= TABS ================= */}

                <div className="flex items-center gap-6 mt-5 border-b border-[#20262e]">
                  <button
                    onClick={() => setActiveTab("scheduled")}
                    className={`relative pb-3 text-[12px] font-medium transition ${
                      activeTab === "scheduled"
                        ? "text-white"
                        : "text-[#68717d] hover:text-[#b8bec6]"
                    }`}
                  >
                    Scheduled Emails

                    {activeTab === "scheduled" && (
                      <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-[#3b82f6] rounded-full" />
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab("sent")}
                    className={`relative pb-3 text-[12px] font-medium transition ${
                      activeTab === "sent"
                        ? "text-white"
                        : "text-[#68717d] hover:text-[#b8bec6]"
                    }`}
                  >
                    Sent Emails

                    {activeTab === "sent" && (
                      <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-[#3b82f6] rounded-full" />
                    )}
                  </button>
                </div>
              </div>

              {/* ================= EMAIL LIST ================= */}

              {emails.length === 0 ? (
                <div className="py-24 text-center px-6">
                  <div className="mx-auto w-14 h-14 rounded-[14px] border border-[#242b34] bg-[#11161c] flex items-center justify-center text-[#59626e]">
                    <Icon name="mail" size={25} />
                  </div>

                  <h3 className="text-[15px] font-semibold text-[#dfe2e7] mt-5">
                    {searchQuery.trim()
                      ? "No emails found"
                      : "No emails found"}
                  </h3>

                  <p className="text-[12px] text-[#626b76] mt-2 max-w-sm mx-auto">
                    {searchQuery.trim()
                      ? "Try searching with a different recipient, subject or sender."
                      : activeTab === "scheduled"
                      ? "Schedule your first email to get started."
                      : "Sent emails will appear here."}
                  </p>

                  {activeTab === "scheduled" &&
                    !searchQuery.trim() && (
                      <button
                        onClick={() => setShowForm(true)}
                        className="mt-6 h-10 px-4 rounded-[9px] bg-[#2563eb] hover:bg-[#1d4ed8] transition text-[12px] font-semibold inline-flex items-center gap-2"
                      >
                        <Icon name="plus" size={15} />
                        Schedule your first email
                      </button>
                    )}
                </div>
              ) : (
                <div className="divide-y divide-[#1c2229]">
                  {emails.map((email) => (
                    <div
                      key={email.id}
                      className="px-5 py-5 hover:bg-[#10151b] transition"
                    >
                      <div className="flex items-start justify-between gap-5">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-[#e5e7eb] truncate">
                              {email.subject}
                            </h3>

                            <span
                              className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                                email.status === "SENT"
                                  ? "bg-[#143221] text-[#4ade80]"
                                  : email.status === "FAILED"
                                  ? "bg-[#32171a] text-[#f87171]"
                                  : "bg-[#1d2938] text-[#60a5fa]"
                              }`}
                            >
                              {email.status}
                            </span>
                          </div>

                          <p className="text-[11px] text-[#68717d] mt-1.5">
                            To: {email.recipient}
                          </p>

                          {email.senderEmail && (
                            <p className="text-[10px] text-[#555e69] mt-1">
                              From: {email.senderEmail}
                            </p>
                          )}
                        </div>

                        <span className="shrink-0 text-[10px] text-[#626b76]">
                          {new Date(
                            activeTab === "sent" && email.sentAt
                              ? email.sentAt
                              : email.scheduledAt
                          ).toLocaleString()}
                        </span>
                      </div>

                      <p className="text-[12px] leading-5 text-[#777f8a] mt-3 line-clamp-2">
                        {email.body}
                      </p>

                      {activeTab === "scheduled" &&
                        email.status === "SCHEDULED" && (
                          <button
                            onClick={() => handleCancel(email.id)}
                            className="mt-4 px-3 py-1.5 rounded-[7px] border border-[#442125] bg-[#211114] text-[#f87171] text-[10px] font-medium hover:bg-[#301519] transition"
                          >
                            Cancel
                          </button>
                        )}

                      {activeTab === "sent" &&
                        (email.status === "SENT" ||
                          email.status === "FAILED") && (
                          <button
                            onClick={() => handleCancel(email.id)}
                            className="mt-4 px-3 py-1.5 rounded-[7px] border border-[#442125] bg-[#211114] text-[#f87171] text-[10px] font-medium hover:bg-[#301519] transition"
                          >
                            Delete
                          </button>
                        )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </main>
        </div>

        {/* ================= SCHEDULE MODAL ================= */}

        {showForm && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0d1116] border border-[#252c34] rounded-[16px] w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 z-10 bg-[#0d1116] border-b border-[#20262e] px-6 py-5 flex items-center justify-between">
                <div>
                  <h2 className="text-[17px] font-semibold text-[#eef0f3]">
                    Schedule Email
                  </h2>

                  <p className="text-[11px] text-[#69727e] mt-1">
                    Choose when your emails should be sent.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="w-8 h-8 rounded-lg text-[#69727e] hover:text-white hover:bg-[#171c22] flex items-center justify-center transition"
                >
                  <Icon name="close" size={18} />
                </button>
              </div>

              <form
                onSubmit={handleSchedule}
                className="p-6 space-y-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-[#aeb5be] mb-2">
                      Sender Email
                    </label>

                    <input
                      required
                      type="email"
                      value={form.senderEmail}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          senderEmail: e.target.value,
                        })
                      }
                      className="w-full h-11 bg-[#090c10] border border-[#252c34] rounded-[9px] px-3.5 text-[12px] text-white outline-none focus:border-[#3b82f6] transition"
                      placeholder="sender@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#aeb5be] mb-2">
                      Sender Name
                    </label>

                    <input
                      required
                      value={form.senderName}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          senderName: e.target.value,
                        })
                      }
                      className="w-full h-11 bg-[#090c10] border border-[#252c34] rounded-[9px] px-3.5 text-[12px] text-white outline-none focus:border-[#3b82f6] transition"
                      placeholder="ReachInbox"
                    />
                  </div>
                </div>

                {/* ================= EMAIL LEADS ================= */}

                <div>
                  <label className="block text-[11px] font-medium text-[#aeb5be] mb-2">
                    Email Leads
                  </label>

                  <label className="relative flex flex-col items-center justify-center min-h-[120px] border border-dashed border-[#303842] rounded-[11px] bg-[#090c10] hover:bg-[#0c1015] hover:border-[#3b82f6] transition cursor-pointer">
                    <input
                      type="file"
                      accept=".csv,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    <div className="w-9 h-9 rounded-lg bg-[#152238] text-[#60a5fa] flex items-center justify-center">
                      <Icon name="upload" size={18} />
                    </div>

                    <p className="text-[12px] font-medium text-[#d4d8de] mt-3">
                      Upload CSV or TXT file
                    </p>

                    <p className="text-[10px] text-[#5f6873] mt-1">
                      Click to browse your recipient list
                    </p>
                  </label>

                  {fileName && (
                    <div className="mt-3 rounded-[9px] border border-[#25344a] bg-[#101925] px-3.5 py-3">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0">
                          <p className="text-[11px] font-medium text-[#8db9ff] truncate">
                            {fileName}
                          </p>

                          <p className="text-[10px] text-[#66778b] mt-1">
                            {leads.length} email address
                            {leads.length !== 1 ? "es" : ""}{" "}
                            detected
                          </p>
                        </div>

                        <Icon name="check" size={16} />
                      </div>
                    </div>
                  )}
                </div>

                {/* ================= SUBJECT ================= */}

                <div>
                  <label className="block text-[11px] font-medium text-[#aeb5be] mb-2">
                    Subject
                  </label>

                  <input
                    required
                    value={form.subject}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        subject: e.target.value,
                      })
                    }
                    className="w-full h-11 bg-[#090c10] border border-[#252c34] rounded-[9px] px-3.5 text-[12px] text-white outline-none focus:border-[#3b82f6] transition"
                    placeholder="Email subject"
                  />
                </div>

                {/* ================= MESSAGE ================= */}

                <div>
                  <label className="block text-[11px] font-medium text-[#aeb5be] mb-2">
                    Message
                  </label>

                  <textarea
                    required
                    rows={6}
                    value={form.body}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        body: e.target.value,
                      })
                    }
                    className="w-full bg-[#090c10] border border-[#252c34] rounded-[9px] px-3.5 py-3 text-[12px] leading-5 text-white outline-none focus:border-[#3b82f6] transition resize-none"
                    placeholder="Write your email..."
                  />
                </div>

                {/* ================= DATE & TIME ================= */}

                <div>
                  <label className="block text-[11px] font-medium text-[#aeb5be] mb-2">
                    Schedule Date & Time
                  </label>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById(
                          "scheduled-date-time"
                        ) as HTMLInputElement | null;

                        input?.showPicker?.();
                        input?.focus();
                      }}
                      className="w-full h-11 bg-[#090c10] border border-[#252c34] rounded-[9px] px-3.5 text-left text-[12px] text-white outline-none hover:border-[#3b82f6] focus:border-[#3b82f6] transition cursor-pointer"
                    >
                      {form.scheduledAt
                        ? new Date(
                            form.scheduledAt
                          ).toLocaleString([], {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Select date & time"}
                    </button>

                    <input
                      id="scheduled-date-time"
                      required
                      type="datetime-local"
                      value={form.scheduledAt}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          scheduledAt: e.target.value,
                        })
                      }
                      className="absolute opacity-0 w-0 h-0 pointer-events-none"
                    />
                  </div>
                </div>

                {/* ================= DELAY / LIMIT ================= */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-[#aeb5be] mb-2">
                      Delay Between Emails
                    </label>

                    <div className="relative">
                      <input
                        required
                        type="number"
                        min="1"
                        value={form.delay}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            delay: Number(e.target.value),
                          })
                        }
                        className="w-full h-11 bg-[#090c10] border border-[#252c34] rounded-[9px] px-3.5 pr-20 text-[12px] text-white outline-none focus:border-[#3b82f6] transition"
                      />

                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#59626d]">
                        seconds
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#aeb5be] mb-2">
                      Hourly Limit
                    </label>

                    <input
                      required
                      type="number"
                      min="1"
                      value={form.hourlyLimit}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          hourlyLimit: Number(e.target.value),
                        })
                      }
                      className="w-full h-11 bg-[#090c10] border border-[#252c34] rounded-[9px] px-3.5 text-[12px] text-white outline-none focus:border-[#3b82f6] transition"
                      placeholder="50"
                    />
                  </div>
                </div>

                {/* ================= ACTIONS ================= */}

                <div className="flex justify-end gap-3 pt-3 border-t border-[#20262e]">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="h-10 px-4 rounded-[9px] border border-[#293039] text-[#9aa2ad] hover:bg-[#151a20] hover:text-white transition text-[12px] font-medium"
                  >
                    Cancel
                  </button>

                  <button
                    disabled={loading}
                    type="submit"
                    className="h-10 px-5 rounded-[9px] bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-50 transition text-[12px] font-semibold flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Scheduling...
                      </>
                    ) : (
                      <>
                        <Icon name="send" size={15} />
                        Schedule Email
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= SETTINGS MODAL ================= */}

        {showSettings && (
          <div className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0d1116] border border-[#252c34] rounded-[16px] w-full max-w-md shadow-2xl">
              <div className="px-6 py-5 border-b border-[#20262e] flex items-center justify-between">
                <div>
                  <h2 className="text-[17px] font-semibold text-[#eef0f3]">
                    Settings
                  </h2>

                  <p className="text-[11px] text-[#69727e] mt-1">
                    Customize your ReachInbox experience.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="w-8 h-8 rounded-lg text-[#69727e] hover:text-white hover:bg-[#171c22] flex items-center justify-center transition"
                >
                  <Icon name="close" size={18} />
                </button>
              </div>

              <div className="p-6">
                <div>
                  <p className="text-[12px] font-medium text-[#aeb5be]">
                    Appearance
                  </p>

                  <p className="text-[10px] text-[#626b76] mt-1">
                    Choose your preferred theme.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  {/* Dark */}

                  <button
                    type="button"
                    onClick={() => handleThemeChange("dark")}
                    className={`p-4 rounded-[10px] border text-left transition ${
                      theme === "dark"
                        ? "border-[#3b82f6] bg-[#152238]"
                        : "border-[#252c34] bg-[#090c10] hover:border-[#39424d]"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#07090c] border border-[#303640] mb-3" />

                    <p className="text-[12px] font-medium text-white">
                      Dark
                    </p>

                    <p className="text-[10px] text-[#626b76] mt-1">
                      Dark interface
                    </p>
                  </button>

                  {/* Light */}

                  <button
                    type="button"
                    onClick={() => handleThemeChange("light")}
                    className={`p-4 rounded-[10px] border text-left transition ${
                      theme === "light"
                        ? "border-[#3b82f6] bg-[#152238]"
                        : "border-[#252c34] bg-[#090c10] hover:border-[#39424d]"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-white border border-[#d1d5db] mb-3" />

                    <p className="text-[12px] font-medium text-white">
                      Light
                    </p>

                    <p className="text-[10px] text-[#626b76] mt-1">
                      Light interface
                    </p>
                  </button>
                </div>

                <div className="mt-6 pt-4 border-t border-[#20262e] flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowSettings(false)}
                    className="h-10 px-4 rounded-[9px] border border-[#293039] text-[#9aa2ad] hover:bg-[#151a20] hover:text-white transition text-[12px] font-medium"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;