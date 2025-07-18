import { THEMES } from "../constants/Themes";
import { useTheme } from "../providers/ThemeProvider";
import { Send } from "lucide-react";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  {
    id: 2,
    content: "I'm doing great! Just working on some new features.",
    isSent: true,
  },
];

const Settings = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="h-fit container mx-auto px-4 pt-20 max-w-5xl">
      <div className="space-y-6">
        <div className="flex sm:flex-row flex-col justify-between items-center">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-bold">Theme</h2>
            <p className="text-sm text-secondary">
              Choose a theme for your chat interface
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-2">
            <h2 className="font-semibold">Current</h2>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-medium"
              style={{
                backgroundColor: THEMES[theme]?.["--accent"] || "#3b82f6",
              }}
            >
              {theme.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs text-secondary">
              {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {Object.keys(THEMES).map((t) => (
            <button
              key={t}
              className={`group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors ${
                theme === t ? "bg-accent/20" : "hover:bg-accent/10"
              }`}
              onClick={() => setTheme(t)}
            >
              <div
                className="relative h-8 w-full rounded-md overflow-hidden flex items-center justify-center"
                style={{
                  backgroundColor: THEMES[t]?.["--bg-primary"] || "#ffffff",
                }}
              >
                <div className="absolute inset-0 grid grid-cols-2 gap-px p-0.5">
                  <div
                    className="rounded-sm"
                    style={{
                      backgroundColor: THEMES[t]?.["--accent"] || "#3b82f6",
                    }}
                  ></div>
                  <div
                    className="rounded-sm"
                    style={{
                      backgroundColor: THEMES[t]?.["--success"] || "#10b981",
                    }}
                  ></div>
                  <div
                    className="rounded-sm"
                    style={{
                      backgroundColor: THEMES[t]?.["--warning"] || "#f59e0b",
                    }}
                  ></div>
                  <div
                    className="rounded-sm"
                    style={{
                      backgroundColor: THEMES[t]?.["--danger"] || "#ef4444",
                    }}
                  ></div>
                </div>
              </div>
              <span className="text-[11px] font-medium truncate w-full text-center">
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </span>
            </button>
          ))}
        </div>

        {/* Preview Section */}
        <h3 className="text-lg font-semibold mb-3">Preview</h3>
        <div
          className="rounded-xl border overflow-hidden shadow-lg"
          style={{
            backgroundColor: THEMES[theme]?.["--bg-secondary"] || "#f3f4f6",
            borderColor: THEMES[theme]?.["--border"] || "#d1d5db",
          }}
        >
          <div
            className="p-4"
            style={{
              backgroundColor: THEMES[theme]?.["--bg-accent"] || "#e5e7eb",
            }}
          >
            <div className="max-w-lg mx-auto">
              <div
                className="rounded-xl shadow-sm overflow-hidden"
                style={{
                  backgroundColor: THEMES[theme]?.["--bg-primary"] || "#ffffff",
                }}
              >
                {/* Chat Header */}
                <div
                  className="px-4 py-3 border-b"
                  style={{
                    backgroundColor:
                      THEMES[theme]?.["--bg-primary"] || "#ffffff",
                    borderColor: THEMES[theme]?.["--border"] || "#d1d5db",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-medium"
                      style={{
                        backgroundColor:
                          THEMES[theme]?.["--accent"] || "#3b82f6",
                      }}
                    >
                      J
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">John Doe</h3>
                      <p className="text-xs text-secondary">Online</p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div
                  className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto"
                  style={{
                    backgroundColor:
                      THEMES[theme]?.["--bg-primary"] || "#ffffff",
                  }}
                >
                  {PREVIEW_MESSAGES.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.isSent ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className="max-w-[80%] rounded-xl p-3 shadow-sm"
                        style={{
                          backgroundColor: message.isSent
                            ? THEMES[theme]?.["--accent"] || "#3b82f6"
                            : THEMES[theme]?.["--bg-secondary"] || "#f3f4f6",
                          color: message.isSent
                            ? "#ffffff"
                            : THEMES[theme]?.["--text-primary"] || "#1f2937",
                        }}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-[10px] mt-1.5 opacity-70">
                          12:00 PM
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div
                  className="p-4 border-t"
                  style={{
                    backgroundColor:
                      THEMES[theme]?.["--bg-primary"] || "#ffffff",
                    borderColor: THEMES[theme]?.["--border"] || "#d1d5db",
                  }}
                >
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 text-sm h-10 rounded-lg border px-3"
                      style={{
                        backgroundColor:
                          THEMES[theme]?.["--bg-primary"] || "#ffffff",
                        borderColor: THEMES[theme]?.["--border"] || "#d1d5db",
                      }}
                      placeholder="Type a message..."
                      value="This is a preview"
                      readOnly
                    />
                    <button
                      className="h-10 px-4 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor:
                          THEMES[theme]?.["--accent"] || "#3b82f6",
                      }}
                    >
                      <Send size={18} className="text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
